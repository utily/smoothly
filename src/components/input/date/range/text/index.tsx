import { Component, Event, EventEmitter, h, Host, Prop, Watch } from "@stencil/core"
import { isoly } from "isoly"

/* 
 The regular input is not suitable for displaying a date range in text mode,
 So we create a custom component for that specific purpose.
 For now it will simply display the value as text and not be editable.
 TODO: Make it editable by splitting the value into two inputs, one for for all necessary combinations of year, month, day.
*/

@Component({
	tag: "smoothly-input-date-range-text",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyInputDateRangeText {
	@Prop() value?: string
	@Prop() locale?: isoly.Locale = navigator.language as isoly.Locale
	@Prop({ reflect: true }) readonly: boolean
	@Prop({ reflect: true }) disabled: boolean
	@Prop({ reflect: true }) invalid: boolean
	@Prop({ reflect: true }) placeholder: string
	@Prop({ reflect: true }) showLabel = true
	@Prop({ reflect: true }) name: string
	@Event() smoothlyInput: EventEmitter<{ [name: string]: string | undefined }>

	getMaxDay() {
		// const month = this.month ? isoly.Date.Month.create(isoly.Date.Month.parse(this.month)) : undefined
		// const year = this.year ? isoly.Date.Year.create(isoly.Date.Year.parse(this.year)) : undefined
		// if (isoly.Date.Month.is(month)) {
		// 	return isoly.Date.Month.length(month, year)
		// } else
		return 31
	}
	@Watch("value")
	valueHandler(newValue: string | undefined) {
		this.smoothlyInput.emit({ [this.name]: newValue })
	}

	render() {
		return (
			<Host>
				<slot name="start" />
				<label class={"label"}>
					<slot />
				</label>
				<div class="smoothly-date-range-text-value">{this.value}</div>
				<slot name="end" />
			</Host>
		)
	}
}
