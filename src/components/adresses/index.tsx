// tslint:disable-next-line: no-implicit-dependencies
import { Component, Event, EventEmitter, Prop, h, Listen } from "@stencil/core"
import { Address, Addresses, Trigger } from "../../model"

@Component({
	tag: "smoothly-addresses",
	scoped: true,
	styleUrl: "style.css",
})
export class SmoothlyAddresses {
	@Prop() allowed: Addresses.Type[] | string = []
	private allowedArrayValue?: Addresses.Type[]
	get allowedArray(): Addresses.Type[] {
		if (!this.allowedArrayValue)
			this.allowedArrayValue = Array.isArray(this.allowed) ? this.allowed : this.allowed.split(" ") as Addresses.Type[]
		return this.allowedArrayValue
	}
	@Prop({ mutable: true }) value: string | Address | Addresses
	get address(): Address | Addresses {
		if (typeof(this.value) == "string")
			this.value = JSON.parse(this.value) as Address | Addresses
		return this.value
	}
	get addresses(): Addresses { return Address.is(this.address) ? { primary: this.address } : { ...this.address } }
	@Prop() editable: boolean
	private editing: Addresses.Type | undefined = undefined
	@Event() change: EventEmitter<Address | Addresses>
	onChange(e: CustomEvent<{ type: Addresses.Type } & Address>) {
		if (Address.is(e.detail)) {
			this.editing = undefined
			const type = e.detail.type
			delete(e.detail.type)
			let result: Address | Addresses
			if (type == "primary" && Address.is(this.address))
				result = { ...e.detail }
			else {
				result = { ...this.addresses }
				result[type] = e.detail
			}
			this.change.emit(this.value = result)
		}
	}
	@Listen("trigger")
	onTrigger(e: CustomEvent<Trigger>) {
		if (e.detail.name == "add" && typeof(this.value) != "string") {
			const result = this.addresses
			const added = Address.create("SE")
			const type = e.detail.value as Addresses.Type
			result[type] = added
			this.value = result
			this.editing = type
		}
	}
	render() {
		const allowed = this.allowedArray.filter(type => Addresses.is(this.address) ? this.address[type] == undefined : type != "primary")
		return [
			Address.is(this.address) ? <smoothly-address editable={ this.editable } value={ this.address } onChange={ (e: CustomEvent<{ type: Addresses.Type } & Address>) => this.onChange(e) }></smoothly-address> :
			Addresses.map(this.address, (type, address) =>
			<smoothly-address mode={ type as Addresses.Type == this.editing ? "edit" : "display" } editable={ this.editable } type={ type as Addresses.Type } value={ address } onChange={ (e: CustomEvent<{ type: Addresses.Type } & Address>) => this.onChange(e) }></smoothly-address>),
			allowed.map(type => <smoothly-trigger color="primary" fill="clear" name="add" value={ type }>+{ type }</smoothly-trigger>),
		]
	}
}
