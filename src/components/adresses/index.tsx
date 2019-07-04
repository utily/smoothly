import { Component, Prop, h } from "@stencil/core"
import { Address, Addresses } from "smoothly-model"

@Component({
	tag: "smoothly-addresses",
	scoped: true,
})
export class SmoothlyAddresses {
	@Prop() value: string | Address | Addresses
	@Prop() editable: boolean
	render() {
		const value = typeof(this.value) == "string" ? JSON.parse(this.value) as Address | Addresses : this.value
		return Address.is(value) ? <smoothly-address editable={ this.editable } value={ value }></smoothly-address> :
		Addresses.map(value, (type, address) => <smoothly-address editable={ this.editable } type={ type as Addresses.Type } value={ address }></smoothly-address>)
	}
}