import { Component, Event, EventEmitter, h, Host, Listen, Prop } from "@stencil/core"
import { Selected } from "./Selected"

@Component({
	tag: "smoothly-radio-button",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyRadioButton {
	@Prop() name?: string
	@Prop({ mutable: true }) value?: any
	@Prop({ reflect: true }) deselectable?: boolean
	@Prop({ reflect: true }) decoration: "button" | "radio" = "radio"
	active?: Selected
	@Event() radioButtonSelected: EventEmitter<{ name: string | undefined; value: any }>

	@Listen("radioItemSelectInternal", { capture: true })
	radioSelectHandler(event: CustomEvent<Selected>) {
		if (this.deselectable || this.active?.value != event.detail.value) {
			this.active?.select(false)
			this.active = event.detail
			this.radioButtonSelected.emit({
				name: this.name,
				value: (this.value = this.active.selected ? this.active.value : undefined),
			})
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
