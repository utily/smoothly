import { Component, h, Prop } from "@stencil/core"
import { address } from "../address-display"
@Component({
	tag: "smoothly-addresses",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAddresses {
	@Prop() value: address[]
	@Prop() editable = false
	render() {
		return this.value.map(value => <smoothly-address value={value}></smoothly-address>)
	}
}
