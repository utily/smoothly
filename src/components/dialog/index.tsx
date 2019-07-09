// tslint:disable-next-line: no-implicit-dependencies
import { Component, Prop, Listen, h } from "@stencil/core"
import { Color, Trigger } from "smoothly-model"

@Component({
	tag: "smoothly-dialog",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDialog {
	@Prop({ reflectToAttr: true }) color: Color | undefined
	@Prop({ mutable: true, reflectToAttr: true }) open: boolean = true
	@Prop({ reflectToAttr: true}) closable: boolean = false
	@Listen("trigger")
	TriggerListener(event: CustomEvent<Trigger>) {
		if (Trigger.is(event.detail) && event.detail.name == "close")
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
			<main>
				{ this.closable ? <smoothly-trigger fill="clear" name="close"><smoothly-icon name="close-circle" fill="solid" color={ this.color }></smoothly-icon></smoothly-trigger> : [] }
				<slot></slot>
			</main>,
		]
	}
}
//
