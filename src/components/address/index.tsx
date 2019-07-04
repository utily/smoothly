import { Component, Prop, h, State, Listen } from "@stencil/core"
import { Address, Addresses } from "smoothly-model"

@Component({
	tag: "smoothly-address",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAddress {
	@Prop() type: Addresses.Type = "primary"
	@Prop() value: string | Address
	@Prop() editable: boolean
	@State() mode: "edit" | "display" = "display"
	@Listen("change")
	onChange(event: CustomEvent<Address>) {
		this.value = event.detail
		this.mode = "display"
	} 
	render() {
		return this.mode == "edit" ?
		[
			<label>{ this.type }</label>,
			<smoothly-address-edit value={ this.value }></smoothly-address-edit>,
		] :
		[
			<label>{ this.type }</label>,
			this.editable ? <smoothly-submit color="primary" fill="clear" prevent onSubmit={ _ => this.mode = "edit" }>Edit</smoothly-submit> : [],
			<smoothly-address-display value={ this.value }></smoothly-address-display>,
		]
	}
}
