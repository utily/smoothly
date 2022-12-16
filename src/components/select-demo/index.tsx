import { Component, h, Listen } from "@stencil/core"
import { Currency } from "isoly"
import { Notice } from "../../model"

@Component({
	tag: "smoothly-select-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySelectDemo {
	private quantityElement?: HTMLSmoothlySelectElement
	private currencies: Currency[] = ["SEK", "EUR"]
	private currency: Currency = "SEK"
	private selectorElement: HTMLSmoothlySelectorElement

	private alertf() {
		console.log(this.quantityElement)
		alert(this.quantityElement?.value)
	}
	@Listen("selectionChanged")
	handleSelectionChanged(event: CustomEvent<{ identifier: string; value: string }>) {
		console.log("selectionChanged", event.detail)
	}

	render() {
		return [
			<smoothly-select identifier="currency">
				{this.currencies.map(option =>
					this.currency == option ? (
						<option value={option} selected>
							{option}
						</option>
					) : (
						<option value={option}>{option}</option>
					)
				)}
			</smoothly-select>,
			<smoothly-select identifier="language">
				<optgroup label="Nordic">
					<option value="sv">Swedish</option>
					<option value="da" selected>
						Danish
					</option>
					<option value="no">Norwegian</option>
				</optgroup>
				<optgroup label="Other">
					<option value="en">English</option>
				</optgroup>
			</smoothly-select>,
			<smoothly-select identifier="quantity" ref={e => (this.quantityElement = e)}>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
			</smoothly-select>,
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
					"--background": "rgb(var(--smoothly-dark-shade))",
					"--border-radius": "4px",
					"--padding": "0 0.75em",
					"--input-width": "6rem",
				}}></smoothly-input-date-range>,
			<smoothly-selector ref={(element: HTMLSmoothlySelectorElement) => (this.selectorElement = element)}>
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
			<button onClick={() => this.alertf()}>press here</button>,
			<smoothly-picker
				label="Filter"
				empty-menu-label="Sorry, we're out of options."
				max-height="58px"
				maxMenuHeight="20rem"
				multiple={true}
				options={[
					{ name: "Big Dog", value: "dog", aliases: ["WOFF"] },
					{ name: "Cat Stevens", value: "cat", aliases: ["moew"], hint: "moew" },
					{ name: "Noble Pig", value: "pig" },
					{ name: "Turtle Wax", value: "turtle", hint: "slow" },
					{ name: "Spider Man", value: "spider" },
					{ name: "Phoenix Order Long Wooord", value: "phoenix" },
					{ name: "Horse Back", value: "horse" },
					{ name: "Unicorn Horn", value: "unicorn" },
					{ name: "Talking Parrot Parrot", value: "parrot" },
					{ name: "Hidden Dragon", value: "dragon" },
					{ name: "Scary Kraken", value: "kraken" },
				]}></smoothly-picker>,
			<br />,
			<smoothly-picker
				label="Multiple"
				empty-menu-label="Sorry, we're out of options."
				max-height="58px"
				multiple={true}
				options={[
					{ name: "Big Dog", value: "dog", aliases: ["WOFF"] },
					{ name: "Cat Stevens", value: "cat", aliases: ["moew"] },
					{ name: "Noble Pig", value: "pig" },
					{ name: "Turtle Wax", value: "turtle" },
					{ name: "Spider Man", value: "spider" },
					{ name: "Phoenix Order Long Wooord", value: "phoenix" },
					{ name: "Horse Back", value: "horse" },
					{ name: "Unicorn Horn", value: "unicorn" },
					{ name: "Talking Parrot Parrot", value: "parrot" },
					{ name: "Hidden Dragon", value: "dragon" },
					{ name: "Scary Kraken", value: "kraken" },
				]}></smoothly-picker>,
			<br />,
			<smoothly-picker
				label="Multiple mutable"
				max-height="58px"
				multiple={true}
				mutable={true}
				newOptionLabel="Invite:"
				options={[
					{ name: "john@example.com", value: "john@example.com" },
					{ name: "jane@example.com", value: "jane@example.com" },
					{ name: "james@example.com", value: "james@example.com" },
					{ name: "jessie@example.com", value: "jessie@example.com" },
				]}
				valueValidator={(email: string) =>
					email.match(/^\w+@\w+/) ? [true, undefined] : [false, Notice.failed("Incorrectly formatted email")]
				}></smoothly-picker>,
			<br />,
			<smoothly-picker
				label="Single select"
				multiple={false}
				max-menu-height="200px"
				options={[
					{ name: "Dog", value: "dog", aliases: ["WOFF"], hint: "Woof 🐶" },
					{ name: "Cat", value: "cat", aliases: ["moew"] },
					{ name: "Pig", value: "pig" },
					{ name: "Turtle", value: "turtle" },
					{ name: "Spider", value: "spider" },
					{ name: "Phoenix", value: "phoenix" },
					{ name: "Horse", value: "horse" },
					{ name: "Unicorn", value: "unicorn" },
					{ name: "Parrot", value: "parrot" },
					{ name: "Dragon", value: "dragon" },
					{ name: "Kraken", value: "kraken" },
				]}></smoothly-picker>,
			<br />,
			<smoothly-picker
				label="readonly"
				readonly={true}
				options={[{ name: "readonly", value: "readonly" }]}></smoothly-picker>,
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
