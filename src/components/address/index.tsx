import { Component, h, Prop } from "@stencil/core"
import { address } from "../address-display"
@Component({
	tag: "smoothly-address",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAddress {
	@Prop() value: address
	@Prop() editable = false
	render() {
		return <smoothly-address-display value={this.value}></smoothly-address-display>
	}
}
