import { Component, h, Listen } from "@stencil/core"
import { Currency, Date } from "isoly"
import { Notice } from "../../model"

@Component({
	tag: "smoothly-0-select-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class Smoothly0SelectDemo {
	private quantityElement?: HTMLSmoothly0SelectElement
	private currencies: Currency[] = ["SEK", "EUR"]
	private currency: Currency = "SEK"
	private selectorElement: HTMLSmoothly0SelectorElement

	private alertf() {
		console.log(this.quantityElement)
		alert(this.quantityElement?.value)
	}
	@Listen("selectionChanged")
	handleSelectionChanged(event: CustomEvent<{ identifier: string; value: string }>) {
		console.log("selectionChanged", event.detail)
	}
	@Listen("dateRangeClear")
	handleDateRangeClear() {
		console.log("dateRangeClear")
	}

	render() {
		return [
			<smoothly-0-select identifier="currency">
				{this.currencies.map(option =>
					this.currency == option ? (
						<option value={option} selected>
							{option}
						</option>
					) : (
						<option value={option}>{option}</option>
					)
				)}
			</smoothly-0-select>,
			<smoothly-0-select identifier="language">
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
			</smoothly-0-select>,
			<smoothly-0-select identifier="quantity" ref={e => (this.quantityElement = e)}>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
			</smoothly-0-select>,
			<smoothly-0-input-date>Date</smoothly-0-input-date>,
			<smoothly-0-input-date value="2021-10-28" max="2021-12-30" min="2021-10-10">
				Date
			</smoothly-0-input-date>,
			<smoothly-0-input-date-range
				clearable
				min={Date.previous(Date.now(), 40)}
				max={Date.next(Date.now(), 40)}></smoothly-0-input-date-range>,
			<smoothly-0-input-date-range
				start={Date.previous(Date.now(), 1)}
				end={Date.next(Date.now(), 1)}
				min={Date.previous(Date.now(), 30)}
				max={Date.next(Date.now(), 30)}
				showLabel={false}
				style={{
					"--background": "rgb(var(--smoothly-dark-shade))",
					"--border-radius": "4px",
					"--padding": "0 0.75em",
					"--input-width": "6rem",
				}}></smoothly-0-input-date-range>,
			<smoothly-0-selector
				initialPrompt="Select..."
				ref={(element: HTMLSmoothly0SelectorElement) => (this.selectorElement = element)}>
				<smoothly-0-item value="1">January</smoothly-0-item>
				<smoothly-0-item value="2">February</smoothly-0-item>
				<smoothly-0-item value="3">March</smoothly-0-item>
				<smoothly-0-item value="4">April</smoothly-0-item>
				<smoothly-0-item value="5">May</smoothly-0-item>
				<smoothly-0-item value="6">June</smoothly-0-item>
				<smoothly-0-item value="7">July</smoothly-0-item>
				<smoothly-0-item value="8">August</smoothly-0-item>
				<smoothly-0-item value="9">September</smoothly-0-item>
				<smoothly-0-item value="10">October</smoothly-0-item>
				<smoothly-0-item value="11">November</smoothly-0-item>
				<smoothly-0-item value="12">December</smoothly-0-item>
			</smoothly-0-selector>,
			<button onClick={async () => this.selectorElement.reset()}>reset selector</button>,
			<button onClick={() => this.alertf()}>press here</button>,
			<smoothly-0-picker
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
				]}></smoothly-0-picker>,
			<br />,
			<smoothly-0-picker
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
				]}></smoothly-0-picker>,
			<br />,
			<smoothly-0-picker
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
				}></smoothly-0-picker>,
			<br />,
			<smoothly-0-picker
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
				]}></smoothly-0-picker>,
			<br />,
			<smoothly-0-picker
				label="readonly"
				readonly={true}
				options={[{ name: "readonly", value: "readonly" }]}></smoothly-0-picker>,
			<br />,
			<smoothly-0-tab-switch>
				<smoothly-0-tab label="test1" open>
					Hello world!
				</smoothly-0-tab>
				<smoothly-0-tab label="test2">this is a test message!</smoothly-0-tab>
				<smoothly-0-tab label="test3">this is a test message again!</smoothly-0-tab>
			</smoothly-0-tab-switch>,

			<smoothly-0-selector initialPrompt="select" style={{ maxWidth: "25px" }} disableFilter={true}>
				<smoothly-0-item>
					<img src="assets/images/da-DK.svg" alt="danish" style={{ width: "25px" }} />
				</smoothly-0-item>
				<smoothly-0-item>
					<img src="assets/images/en-GB.svg" alt="british english" />
				</smoothly-0-item>
				<smoothly-0-item>
					<img src="assets/images/en-US.svg" alt="american english" />
				</smoothly-0-item>
			</smoothly-0-selector>,
		]
	}
}
