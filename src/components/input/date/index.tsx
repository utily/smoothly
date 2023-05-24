import { Component, Event, EventEmitter, Fragment, h, Host, Listen, Prop } from "@stencil/core"
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
	@Event() smoothlyFormInput: EventEmitter<void>
	componentWillLoad() {
		this.smoothlyFormInput.emit()
	}

	@Listen("dateSet")
	dateSetHandler(e: CustomEvent<Date>) {
		this.open = false
		e.stopPropagation()
	}

	render() {
		return (
			<Host>
				<smoothly-input
					name={this.name}
					onFocus={() => (this.open = true)}
					onClick={() => (this.open = true)}
					disabled={this.disabled}
					type="date"
					value={this.value}
					onSmoothlyInput={e => (this.value = e.detail[this.name])}
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
