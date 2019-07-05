// tslint:disable-next-line: no-implicit-dependencies
import { Component, Prop, h } from "@stencil/core"
import { Address } from "smoothly-model"
import * as isoly from "isoly"

@Component({
	tag: "smoothly-address-display",
	scoped: true,
	styleUrl: "style.css",
})
export class AddressDisplay {
	@Prop() value: string | Address
	render() {
		const value = typeof(this.value) == "string" ? JSON.parse(this.value) as Address : this.value
		return Address.SE.is(value) || Address.FI.is(value) ?
		[
			<address>
				{ value.street }<br />
				{ value.zipCode } { value.city }<br />
				{ isoly.CountryCode.Name.from("en", value.countryCode) }
			</address>,
		] :
		<p>Unknown address country: { JSON.stringify(value) }</p>
	}
}
