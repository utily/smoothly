import { Component, h, Listen, Prop } from "@stencil/core"
import { Color, Trigger } from "../../model"

@Component({
	tag: "smoothly-0-dialog",
	styleUrl: "style.css",
	scoped: true,
})
export class Smoothly0Dialog {
	@Prop({ reflect: true }) color: Color | undefined
	@Prop({ mutable: true, reflect: true }) open = true
	@Prop({ reflect: true }) closable = false
	@Prop({ reflect: true }) header: string | undefined
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
					<smoothly-0-trigger fill="clear" name="close">
						<smoothly-0-icon name="close-circle" fill="solid" color={this.color}></smoothly-0-icon>
					</smoothly-0-trigger>
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
