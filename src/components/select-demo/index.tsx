import { Component, h, Listen } from "@stencil/core"

@Component({
	tag: "smoothly-select-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySelectDemo {
	private selectorElement: HTMLSmoothlySelectorElement

	@Listen("selectionChanged")
	handleSelectionChanged(event: CustomEvent<{ identifier: string; value: string }>) {
		console.log("selectionChanged", event.detail)
	}

	render() {
		return [
			<smoothly-input-date>Date</smoothly-input-date>,
			<smoothly-input-date value="2021-10-28" max="2021-12-30" min="2021-10-10">
				Date
			</smoothly-input-date>,
			<smoothly-input-date-range
				start="2022-10-28"
				end="2022-11-27"
				min="2021-10-10"
				max="2022-12-30"></smoothly-input-date-range>,
			<smoothly-input-date-range
				start="2022-10-28"
				end="2022-11-27"
				min="2021-10-10"
				max="2022-12-30"
				showLabel={false}
				style={{
					"--border-radius": "4px",
					"--padding": "0 0.75em",
					"--input-width": "6rem",
				}}></smoothly-input-date-range>,
			<smoothly-selector
				initialPrompt="Select..."
				ref={(element: HTMLSmoothlySelectorElement) => (this.selectorElement = element)}>
				<smoothly-item value="1">January</smoothly-item>
				<smoothly-item value="2">February</smoothly-item>
				<smoothly-item value="3">March</smoothly-item>
				<smoothly-item value="4">April</smoothly-item>
				<smoothly-item value="5">May</smoothly-item>
				<smoothly-item value="6">June</smoothly-item>
				<smoothly-item value="7">July</smoothly-item>
				<smoothly-item value="8">August</smoothly-item>
				<smoothly-item value="9">September</smoothly-item>
				<smoothly-item value="10">October</smoothly-item>
				<smoothly-item value="11">November</smoothly-item>
				<smoothly-item value="12">December</smoothly-item>
			</smoothly-selector>,
			<button onClick={async () => this.selectorElement.reset()}>reset selector</button>,
			<br />,
			<smoothly-tab-switch>
				<smoothly-tab label="test1" open>
					Hello world!
				</smoothly-tab>
				<smoothly-tab label="test2">this is a test message!</smoothly-tab>
				<smoothly-tab label="test3">this is a test message again!</smoothly-tab>
			</smoothly-tab-switch>,
		]
	}
}
