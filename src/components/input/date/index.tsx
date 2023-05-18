import { Component, Event, EventEmitter, h, Listen, Method, Prop, Watch } from "@stencil/core"
import { Date } from "isoly"

@Component({
	tag: "smoothly-input-date",
	styleUrl: "style.css",
	scoped: true,
})
export class InputDate {
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) value?: Date
	@Prop({ mutable: true }) open: boolean
	@Prop({ mutable: true }) max: Date
	@Prop({ mutable: true }) min: Date
	@Prop({ mutable: true }) disabled: boolean
	@Prop({ mutable: true, reflect: true }) readonly?: boolean
	@Event() smoothlyInput: EventEmitter<Record<string, Date | undefined>>
	@Event() valueChanged: EventEmitter<Date>
	@Watch("value")
	onStart(next: Date) {
		this.valueChanged.emit(next)
	}
	@Listen("dateSet")
	dateSetHandler(e: CustomEvent<Date>) {
		this.open = false
		e.stopPropagation()
	}
	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Method()
	async setReadonly(readonly: boolean): Promise<void> {
		this.readonly = readonly
	}
	componentWillLoad() {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}
	private handleClick() {
		if (!this.readonly)
			this.open = !this.open
	}
	render() {
		return [
			<smoothly-input
				readonly={this.readonly}
				name={this.name}
				onFocus={() => this.handleClick()}
				onClick={() => this.handleClick()}
				disabled={this.disabled}
				type="date"
				value={this.value}
				onSmoothlyInput={e => (this.value = e.detail[this.name])}>
				<slot></slot>
			</smoothly-input>,
			this.open && !this.disabled
				? [
						<div onClick={() => (this.open = false)}></div>,
						<nav>
							<div class="arrow"></div>
							<smoothly-calendar
								doubleInput={false}
								value={this.value ?? Date.now()}
								onValueChanged={event => {
									this.value = event.detail
									event.stopPropagation()
								}}
								max={this.max}
								min={this.min}></smoothly-calendar>
						</nav>,
				  ]
				: [],
		]
	}
}
