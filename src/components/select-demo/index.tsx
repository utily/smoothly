import { Component, h, Listen } from "@stencil/core"
import { Currency } from "isoly"

@Component({
	tag: "smoothly-select-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySelectDemo {
	private quantityElement?: HTMLSmoothlySelectElement
	private currencies: Currency[] = ["SEK", "EUR"]
	private currency: Currency = "SEK"

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
			<smoothly-selector>
				<smoothly-item value="test1"></smoothly-item>
				<smoothly-item value="test2"></smoothly-item>
				<smoothly-item value="test3"></smoothly-item>
			</smoothly-selector>,
			<button onClick={() => this.alertf()}>press here</button>,
			<smoothly-picker
				label="Filter"
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
				label=""
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
				label="filter"
				multiple={false}
				max-menu-height="200px"
				options={[
					{ name: "Dog", value: "dog", aliases: ["WOFF"], description: "Woof 🐶" },
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
		]
	}
}
