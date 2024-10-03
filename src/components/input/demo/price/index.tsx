import { Component, h, Host, State, VNode } from "@stencil/core"
import { isoly } from "isoly"

@Component({
	tag: "smoothly-input-price-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputPriceDemo {
	@State() currencies: isoly.Currency[] = ["EUR", "USD", "GBP"]
	@State() currency?: isoly.Currency = "USD"

	render(): VNode | VNode[] {
		return (
			<Host>
				<h2>State demo on smoothly-input</h2>
				<p>This demo/test the internal state of the smoothly-input component.</p>
				<p>The currency of the price should update when switching between the currencies.</p>
				<smoothly-input-radio
					name={"currency"}
					onSmoothlyInput={e => (this.currency = isoly.Currency.is(e.detail.currency) ? e.detail.currency : undefined)}>
					{this.currencies.map(currency => (
						<smoothly-input-radio-item key={currency} selected={currency == this.currency} value={currency}>
							{currency}
						</smoothly-input-radio-item>
					))}
				</smoothly-input-radio>
				<smoothly-input type={"price"} currency={this.currency}>
					price
				</smoothly-input>
			</Host>
		)
	}
}
