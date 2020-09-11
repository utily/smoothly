import { Component, Prop, Listen, h } from "@stencil/core"
import { Color, Trigger } from "../../model"

@Component({
	tag: "smoothly-dialog",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDialog {
	@Prop({ reflect: true }) color: Color | undefined
	@Prop({ mutable: true, reflect: true }) open = true
	@Prop({ reflect: true }) closable = false
	@Prop() header: string | undefined
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
			<header>
				{this.closable ? (
					<smoothly-trigger fill="clear" name="close">
						<smoothly-icon name="close-circle" fill="solid" color={this.color}></smoothly-icon>
					</smoothly-trigger>
				) : (
					[]
				)}
				{this.header ? <h1>{this.header}</h1> : <slot name="header"></slot>}
			</header>,
			<main>
				<slot></slot>
			</main>,
		]
	}
}
//
