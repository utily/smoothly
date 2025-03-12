import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-form-demo-prices",
	scoped: true,
})
export class SmoothlyFormDemoPrices {
	render(): VNode | VNode[] {
		return (
			<Host>
				<h2>Prices</h2>
				<smoothly-form looks="line">
					<smoothly-input type="price" name="no">
						No currency
					</smoothly-input>
					<smoothly-input type="price" name="crowns" currency="SEK" toInteger>
						SEK (toInteger)
					</smoothly-input>
					<smoothly-input type="price" name="usDollar" currency="USD">
						USD
					</smoothly-input>
					<smoothly-input type="price" name="pounds" currency="GBP">
						GBP
					</smoothly-input>
					<smoothly-input type="price" name="peso" currency="UYW">
						UYW
					</smoothly-input>
					<smoothly-input type="price" name="iceland" currency="ISK">
						ISK
					</smoothly-input>
					<smoothly-input type="price" name="Palladium" currency="XPD">
						{"XPD (Palladium)"}
					</smoothly-input>
					<smoothly-input-reset slot="reset" fill="default" type="form" color="warning" />
					<smoothly-input-submit slot="submit" />
				</smoothly-form>
			</Host>
		)
	}
}
