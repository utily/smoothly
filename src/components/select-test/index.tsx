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

	@Listen("selectionChanged")
	handleSelectionChanged(event: CustomEvent<{ identifier: string, value: string }>) {
		console.log("selectionChanged", event.detail)
	}

	render() {
		return [
			<smoothly-select identifier="currency" options={ this.currencies }></smoothly-select>,
			<smoothly-select identifier="language" options={ this.languages }></smoothly-select>
		]
	}
}
