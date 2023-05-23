import { Component, Event, EventEmitter, Fragment, h, Host, Listen, Prop, Watch } from "@stencil/core"
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
	@Event() smoothlyBlur: EventEmitter<void>
	@Event() smoothlyFocus: EventEmitter<void>
	@Event() smoothlyChange: EventEmitter<Record<string, any>>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyFormInput: EventEmitter<void>
	componentWillLoad() {
		this.smoothlyFormInput.emit()
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	@Watch("value")
	onStart(value: Date, pre: Date | undefined) {
		if (value != pre)
			this.smoothlyChange.emit({ [this.name]: this.value })
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	@Listen("dateSet")
	dateSetHandler(e: CustomEvent<Date>) {
		this.open = false
		e.stopPropagation()
	}

	onFocus() {
		this.open = true
		this.smoothlyFocus.emit()
	}

	onBlur() {
		this.smoothlyBlur.emit()
	}

	render() {
		return (
			<Host>
				<input
					name={this.name}
					onFocus={() => this.onFocus()}
					onBlur={() => this.onBlur()}
					disabled={this.disabled}
					type="date"
					value={this.value}
					onInput={e => (this.value = (e.target as HTMLInputElement).value)}
				/>
				{this.open && !this.disabled && (
					<Fragment>
						<div class="overlayer" onClick={() => (this.open = false)}></div>
						<div class="container">
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
						</div>
					</Fragment>
				)}
			</Host>
		)
	}
}
