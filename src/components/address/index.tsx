import { Component, Prop, h, State, Listen } from "@stencil/core"
import { Address } from "smoothly-model"

@Component({
	tag: "smoothly-address",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAddress {
	@Prop() type: string
	@Prop() value: string | Address
	@Prop() editable: boolean
	@State() mode: "edit" | "display" = "display"
	@Listen("change")
	onChange(event: CustomEvent<Address>) {
		this.value = event.detail
		this.mode = "display"
	} 
	render() {
		let array = this.mode == "edit" ?
		[
			<smoothly-address-edit type= { this.type } value= { this.value }></smoothly-address-edit>,
		] :
		[
			<smoothly-submit color="primary" fill="clear" prevent onSubmit= { _ => this.mode = "edit" }>Edit</smoothly-submit>,
			<smoothly-address-display type= { this.type } value= { this.value }></smoothly-address-display>,
		]
		return array
	}
}
