import { Component, Prop } from "@stencil/core"
import { Currency } from "isoly"

@Component({
	tag: "smoothly-display-amount",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayAmount {
	@Prop() amount: number
	@Prop() currency: Currency

	render() {

		return [
			this.amount.toFixed(Currency.decimalDigits(this.currency)),
			" ",
			this.currency,
		]
	}
}
