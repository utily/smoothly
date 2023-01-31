import { Component, Event, EventEmitter, h, Listen, Prop, Watch } from "@stencil/core"
import { Date } from "isoly"
import { Color } from "../../model"

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
	@Prop({ mutable: true }) color: Color = "default"
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
	render() {
		return [
			<smoothly-input
				name={this.name}
				onFocus={() => (this.open = !this.open)}
				onClick={() => (this.open = !this.open)}
				disabled={this.disabled}
				type="date"
				value={this.value}
				onSmoothlyInput={e => (this.value = e.detail.value)}>
				<slot></slot>
			</smoothly-input>,
			this.open && !this.disabled
				? [
						<div onClick={() => (this.open = false)}></div>,
						<nav>
							<div class="arrow" color={this.color}></div>
							<smoothly-calendar
								doubleInput={false}
								value={this.value ?? Date.now()}
								onValueChanged={event => {
									this.value = event.detail
									event.stopPropagation()
								}}
								color={this.color}
								max={this.max}
								min={this.min}></smoothly-calendar>
						</nav>,
				  ]
				: [],
		]
	}
}
