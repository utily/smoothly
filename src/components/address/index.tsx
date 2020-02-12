// tslint:disable-next-line: no-implicit-dependencies
import { Component, Event, EventEmitter, Prop, h } from "@stencil/core"
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
	@Prop({ mutable: true }) mode: "edit" | "display" = "display"
	@Event() change: EventEmitter<{ type: Addresses.Type } & Address>
	onChange(event: CustomEvent<Address>) {
		event.stopPropagation()
		this.value = event.detail
		this.mode = "display"
		this.change.emit({ type: this.type, ...this.value })
	}
	render() {
		return this.mode == "edit" ?
		[
			<label>{ this.type }</label>,
			<smoothly-address-edit onChange={ (e: CustomEvent<Address>) => this.onChange(e) } value={ this.value }></smoothly-address-edit>,
		] :
		[
			<label>{ this.type }</label>,
			this.editable ? <smoothly-submit color="primary" fill="clear" prevent onSubmit={ () => this.mode = "edit" }>Edit</smoothly-submit> : [],
			<smoothly-address-display value={ this.value }></smoothly-address-display>,
		]
	}
}
