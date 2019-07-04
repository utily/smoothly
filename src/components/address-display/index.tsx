import { Component, Prop, h } from "@stencil/core"
import { Address, Addresses } from "smoothly-model"
import * as isoly from "isoly"

@Component({
	tag: "smoothly-address-display",
	scoped: true,
})
export class AddressDisplay {
	@Prop() type: string
	@Prop() value: string | Address | Addresses
	render() {
		const value = typeof(this.value) == "string" ? JSON.parse(this.value) as Address | Addresses : this.value
		return Address.SE.is(value) || Address.FI.is(value) ?
		[
			<address>
				{ value.street }<br />
				{ value.zipCode } { value.city }<br />
				{ isoly.CountryCode.Name.from("en", value.countryCode) }
			</address>,
		] :
		Address.is(value) ? <p>Unknown address country: { JSON.stringify(value) }</p> :
		Addresses.map(value, (type, address) => <smoothly-address-display type={ type } value={ address }></smoothly-address-display>)
	}
}
