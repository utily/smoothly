// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Prop, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-popup",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPopup {
	@Prop({ mutable: true, reflect: true }) visible = false
	private onClick(event: UIEvent) {
		this.visible = !this.visible
	}
	render() {
		return (
			<Host>
				<content class="pointer" onClick={(e: UIEvent) => this.onClick(e)}>
					<slot></slot>
				</content>
				<div class="background" onClick={(e: UIEvent) => this.onClick(e)}></div>
				<div class="arrow" onClick={(e: UIEvent) => this.onClick(e)}></div>
				<aside>
					<slot name="popup"></slot>
				</aside>
			</Host>
		)
	}
}
