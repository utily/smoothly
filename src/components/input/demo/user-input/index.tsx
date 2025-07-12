import { Component, h, Host, State } from "@stencil/core"
import { isoly } from "isoly"

@Component({
	tag: "smoothly-input-demo-user-input",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDemoUserInput {
	private readonly values = ["zero", "one", "two", "three", "four", "five"]
	@State() textIndex?: number
	@State() selectIndex?: number
	@State() checkboxChecked: boolean
	@State() radioIndex?: number
	@State() rangeValue?: number
	private readonly colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff"]
	@State() colorIndex?: number
	@State() dateValue?: isoly.Date
	@State() datetimeValue?: isoly.DateTime
	@State() dateRangeValue?: isoly.DateRange

	increment(index?: number): number {
		return index === undefined ? 0 : (index + 1) % this.values.length
	}

	render() {
		return (
			<Host>
				<div>
					<h2>User Input Event</h2>
					<p>
						These inputs demonstrate how user input is handled. The <code>smoothlyUserInput</code> event fires only when
						the user interacts with an input, not when its value is changed programmatically (such as by clicking the
						buttons above).
						<br />
						Check the console to see the details of each <code>smoothlyUserInput</code> event.
					</p>
				</div>
				<smoothly-button color="tertiary" onClick={() => (this.textIndex = this.increment(this.textIndex))}>
					Change text
				</smoothly-button>
				<smoothly-input
					looks="border"
					name="demo-user-input-text"
					value={this.textIndex === undefined ? "" : this.values[this.textIndex]}
					onSmoothlyUserInput={e => console.debug("smoothlyUserInput", e.detail.name, e.detail.value)}>
					Text input
				</smoothly-input>

				<smoothly-button onClick={() => (this.selectIndex = this.increment(this.selectIndex))} color="tertiary">
					Next select item
				</smoothly-button>
				<smoothly-input-select
					looks="border"
					name="demo-user-input-select"
					onSmoothlyUserInput={e => console.debug("smoothlyUserInput", e.detail.name, e.detail.value)}>
					<span slot="label">Select input</span>
					{this.values.map((value, index) => (
						<smoothly-item value={index} selected={index == this.selectIndex}>
							{value}
						</smoothly-item>
					))}
				</smoothly-input-select>

				<smoothly-button color="tertiary" onClick={() => (this.checkboxChecked = !this.checkboxChecked)}>
					Toggle checkbox
				</smoothly-button>
				<smoothly-input-checkbox
					looks="border"
					name="demo-user-input-checkbox"
					checked={this.checkboxChecked}
					onSmoothlyUserInput={e => console.debug("smoothlyUserInput", e.detail.name, e.detail.value)}>
					Checkbox input
				</smoothly-input-checkbox>

				<smoothly-button color="tertiary" onClick={() => (this.radioIndex = this.increment(this.radioIndex))}>
					Next radio item
				</smoothly-button>
				{/* Bug: radio has bugs when changing programmatically - TODO: consider changing to using a regular radio input as underlying controls */}
				<smoothly-input-radio
					looks="border"
					name="demo-user-input-radio"
					onSmoothlyUserInput={e => console.debug("smoothlyUserInput", e.detail.name, e.detail.value)}>
					<span slot="label">Radio input</span>
					{this.values.map((value, index) => (
						<smoothly-input-radio-item value={value} selected={index == this.radioIndex}>
							{value}
						</smoothly-input-radio-item>
					))}
				</smoothly-input-radio>

				{/* Not sure how to test smoothly-input-file */}

				<smoothly-button color="tertiary" onClick={() => (this.rangeValue = this.increment(this.rangeValue))}>
					Next range value
				</smoothly-button>
				<smoothly-input-range
					looks="border"
					name="demo-user-input-range"
					step={1}
					min={0}
					max={this.values.length}
					value={this.rangeValue}
					label={"Range Input"}
					onSmoothlyUserInput={e => console.debug("smoothlyInputUserInput", e.detail.name, e.detail.value)}
				/>

				<smoothly-button color="tertiary" onClick={() => (this.colorIndex = this.increment(this.colorIndex))}>
					Next color
				</smoothly-button>
				<smoothly-input-color
					looks="border"
					name="demo-user-input-color"
					value={typeof this.colorIndex == "number" ? this.colors[this.colorIndex] : undefined}
					onSmoothlyUserInput={e => console.debug("smoothlyUserInput", e.detail.name, e.detail.value)}>
					Color input
				</smoothly-input-color>

				<smoothly-button
					color="tertiary"
					onClick={() => (this.dateValue = this.dateValue ? isoly.Date.next(this.dateValue) : isoly.Date.now())}>
					Next day
				</smoothly-button>
				<smoothly-input-date
					looks="border"
					name="demo-user-input-date"
					value={this.dateValue}
					onSmoothlyUserInput={e => console.debug("smoothlyUserInput", e.detail.name, e.detail.value)}>
					Date input
				</smoothly-input-date>

				<smoothly-button
					color="tertiary"
					onClick={() =>
						(this.datetimeValue = this.datetimeValue
							? isoly.DateTime.nextDay(this.datetimeValue)
							: isoly.DateTime.now())
					}>
					Next date time
				</smoothly-button>
				<smoothly-input-date-time
					looks="border"
					name="demo-user-input-datetime"
					value={this.datetimeValue}
					onSmoothlyUserInput={e => console.debug("smoothlyUserInput", e.detail.name, e.detail.value)}>
					Date time input
				</smoothly-input-date-time>

				<smoothly-button
					color="tertiary"
					onClick={() =>
						(this.dateRangeValue = this.dateRangeValue
							? { start: isoly.Date.next(this.dateRangeValue.start), end: isoly.Date.next(this.dateRangeValue.end) }
							: { start: isoly.Date.now(), end: isoly.Date.next(isoly.Date.now(), 10) })
					}>
					Next date range
				</smoothly-button>
				<smoothly-input-date-range
					looks="border"
					name="demo-user-input-daterange"
					start={this.dateRangeValue?.start}
					end={this.dateRangeValue?.end}
					onSmoothlyUserInput={e => console.debug("smoothlyUserInput", e.detail.name, e.detail.value)}>
					Date range input
				</smoothly-input-date-range>
			</Host>
		)
	}
}
