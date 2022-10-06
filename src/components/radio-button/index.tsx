import { Component, h, Host, Listen, Prop } from "@stencil/core"
import { Selected } from "./Selected"

@Component({
	tag: "smoothly-radio-button",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyRadioButton {
	@Prop({ mutable: true }) value?: any
	active?: Selected

	@Listen("radioSelect")
	radioSelectHandler(event: CustomEvent<Selected>) {
		this.active?.select(false)
		this.active = event.detail
		this.value = this.active.selected ? event.detail.value : undefined
		this.active.select(this.active.selected)
	}

	render() {
		return (
			<Host>
				<slot></slot>
			</Host>
		)
	}
}
