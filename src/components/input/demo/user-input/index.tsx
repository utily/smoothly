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

	nextIndex(index?: number): number {
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
				<smoothly-button color="primary" onClick={() => (this.textIndex = this.nextIndex(this.textIndex))}>
					Change text
				</smoothly-button>
				<smoothly-input
					name="demo-user-input-text"
					value={this.textIndex === undefined ? "" : this.values[this.textIndex]}
					onSmoothlyUserInput={e => console.debug("smoothlyUserInput", e.detail.name, e.detail.value)}>
					Text input
				</smoothly-input>

				<smoothly-button onClick={() => (this.selectIndex = this.nextIndex(this.selectIndex))} color="primary">
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

				<smoothly-button color="primary" onClick={() => (this.radioIndex = this.nextIndex(this.radioIndex))}>
					Next radio item
				</smoothly-button>
				{/* Bug: radio has bugs when changing programmatically - TODO: change to using a regular radio input as underlying controls */}
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
			</Host>
		)
	}
}
