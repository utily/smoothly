import { Component, Event, EventEmitter, h, Host, Listen, Prop } from "@stencil/core"
import { Selected } from "./Selected"

@Component({
	tag: "smoothly-radio-button",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyRadioButton {
	@Prop({ mutable: true }) value?: any
	@Prop({ reflect: true }) deselectable?: boolean
	@Prop({ reflect: true }) decoration: "button" | "radio" = "radio"
	active?: Selected
	@Event() radioButtonSelected: EventEmitter<any>

	@Listen("radioItemSelectInternal", { capture: true })
	radioSelectHandler(event: CustomEvent<Selected>) {
		if (this.deselectable || this.active?.value != event.detail.value) {
			this.active?.select(false)
			this.active = event.detail
			this.radioButtonSelected.emit((this.value = this.active.selected ? event.detail.value : undefined))
			this.active.select(this.active.selected)
		}
	}

	render() {
		return (
			<Host>
				<slot></slot>
			</Host>
		)
	}
}
