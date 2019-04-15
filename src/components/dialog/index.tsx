import { Component, Prop, Element, Event, EventEmitter, Listen, Method } from "@stencil/core"
import { Color } from "../../Color"
import { Action } from "../../Action"

@Component({
	tag: "smoothly-dialog",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDialog {
	@Prop({ reflectToAttr: true }) color: Color | undefined
	@Prop({ mutable: true, reflectToAttr: true }) open: boolean = true
	@Listen("smoothlyAction")
	actionListener(event: CustomEvent<Action>) {
		if (Action.is(event.detail) && event.detail.name == "close")
			this.open = false
	}
	hostData() {
		return {
			style: {
				display: this.open ? "block" : "none",
			},
		}
	}
	render() {
		return [
			<article><slot></slot></article>,
		]
	}
}
