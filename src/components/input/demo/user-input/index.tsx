import { Component, h, Host, State } from "@stencil/core"

@Component({
	tag: "smoothly-input-demo-user-input",
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

	increment(index?: number): number {
		return index === undefined ? 0 : (index + 1) % this.values.length
	}

	render() {
		return (
			<Host>
				<h2>User Input</h2>
				<p>
					These inputs demonstrate how user input is handled. The <code>smoothlyUserInput</code> event fires only when
					the user interacts with an input, not when its value is changed programmatically (such as by clicking the
					buttons above).
					<br />
					Check the console to see the details of each <code>smoothlyUserInput</code> event.
				</p>
				<smoothly-button color="primary" onClick={() => (this.textIndex = this.increment(this.textIndex))}>
					Change text
				</smoothly-button>
				<smoothly-input
					name="demo-user-input-text"
					value={this.textIndex === undefined ? "" : this.values[this.textIndex]}
					onSmoothlyUserInput={e => console.debug("smoothlyUserInput", e.detail.name, e.detail.value)}>
					Text input
				</smoothly-input>

				<smoothly-button onClick={() => (this.selectIndex = this.increment(this.selectIndex))} color="primary">
					Next select item
				</smoothly-button>
				<smoothly-input-select
					name="demo-user-input-select"
					onSmoothlyUserInput={e => console.debug("smoothlyUserInput", e.detail.name, e.detail.value)}>
					<span slot="label">Select input</span>
					{this.values.map((value, index) => (
						<smoothly-item value={index} selected={index == this.selectIndex}>
							{value}
						</smoothly-item>
					))}
				</smoothly-input-select>

				<smoothly-button color="primary" onClick={() => (this.checkboxChecked = !this.checkboxChecked)}>
					Toggle checkbox
				</smoothly-button>
				<smoothly-input-checkbox
					name="demo-user-input-checkbox"
					checked={this.checkboxChecked}
					onSmoothlyUserInput={e => console.debug("smoothlyUserInput", e.detail.name, e.detail.value)}>
					Checkbox input
				</smoothly-input-checkbox>

				<smoothly-button color="primary" onClick={() => (this.radioIndex = this.increment(this.radioIndex))}>
					Next radio item
				</smoothly-button>
				{/* Bug: radio has bugs when changing programmatically - TODO: consider changing to using a regular radio input as underlying controls */}
				<smoothly-input-radio
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

				<smoothly-button color="primary" onClick={() => (this.rangeValue = this.increment(this.rangeValue))}>
					Next range value
				</smoothly-button>
				<smoothly-input-range
					name="demo-user-input-range"
					step={1}
					min={0}
					max={this.values.length}
					value={this.rangeValue}
					label={"Range Input"}
					onSmoothlyUserInput={e => console.debug("smoothlyInputUserInput", e.detail.name, e.detail.value)}
				/>

				<smoothly-button color="primary" onClick={() => (this.colorIndex = this.increment(this.colorIndex))}>
					Next color
				</smoothly-button>
				<smoothly-input-color
					name="demo-user-input-color"
					value={typeof this.colorIndex == "number" ? this.colors[this.colorIndex] : undefined}
					onSmoothlyUserInput={e => console.debug("smoothlyUserInput", e.detail.name, e.detail.value)}>
					Color input
				</smoothly-input-color>
			</Host>
		)
	}
}
