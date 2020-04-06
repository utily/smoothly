// tslint:disable-next-line: no-implicit-dependencies
import { Component, Listen, h } from "@stencil/core"
import { Currency, Language } from "isoly"

@Component({
	tag: "smoothly-select-test",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySelectTest {
	private currencies: Currency[] = ["SEK", "EUR"]
	private languages: Language[] = ["sv", "en"]
	private currency: Currency = "SEK"
	private language: Language = "sv"

	@Listen("selectionChanged")
	handleSelectionChanged(event: CustomEvent<{ identifier: string, value: string }>) {
		console.log("selectionChanged", event.detail)
	}

	render() {
		return [
			// <smoothly-select identifier="currency" options={ this.currencies } selected={ "EUR" }></smoothly-select>,
			// <smoothly-select identifier="language" options={ this.languages }></smoothly-select>
			<smoothly-select identifier="currency">
				{/* { this.currencies.map(option => <option selected={ option == this.currency } value={ option }>{ option }</option>) } */}
				{ this.currencies.map(option => this.currency == option ? <option value={ option } selected>{ option }</option> : <option value={ option }>{ option }</option>) }
			</smoothly-select>,
			// <smoothly-select identifier="language">
			// 	{ this.languages.map(option => this.language == option ? <option value={ option } selected>{ option }</option> : <option value={ option }>{ option }</option>) }
			// </smoothly-select>,
			<smoothly-select identifier="language">
				<optgroup label="Nordic">
					<option value="sv">Swedish</option>
					<option value="da" selected>Danish</option>
					<option value="no">Norwegian</option>
				</optgroup>
				<optgroup label="Other">
					<option value="en">English</option>
				</optgroup>
		</smoothly-select>
		]
	}
}
