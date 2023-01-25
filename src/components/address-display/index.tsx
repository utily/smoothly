import { Component, h, Prop } from "@stencil/core"
import * as isoly from "isoly"

export interface address {
	allowed?: string
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
	@Prop() editable: boolean
	render() {
		if (this.editable) {
			return [
				<div>
					<h4>{this.value.allowed}:</h4>
					<smoothly-input type="text" name="street" value={this.value.street}>
						Street
					</smoothly-input>
					<smoothly-input type="postal-code" name="zip" value={this.value.zipCode}>
						ZipCode
					</smoothly-input>
					<smoothly-input type="text" name="city" value={this.value.city}>
						City
					</smoothly-input>
					<smoothly-input type="text" name="countryCode" value={this.value.countryCode}>
						CountryCode
					</smoothly-input>
				</div>,
			]
		} else {
			return [
				<div>
					<h4>{this.value.allowed}:</h4>
					<p>{this.value.street}</p>
					<p>{this.value.zipCode}</p>
					<p>{this.value.city}</p>
					<p>{this.value.countryCode}</p>
				</div>,
			]
		}
	}
}
