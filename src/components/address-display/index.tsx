import { Component, h, Prop } from "@stencil/core"
import * as isoly from "isoly"

export interface address {
	countryCode: isoly.CountryCode.Alpha2
	street: string
	zipCode: string
	city: string
}

@Component({
	tag: "smoothly-address-display",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAddressDisplay {
	@Prop() value: address
	render() {
		return [
			<p>{this.value.countryCode}</p>,
			<p>{this.value.street}</p>,
			<p>{this.value.zipCode}</p>,
			<p>{this.value.city}</p>,
		]
	}
}
