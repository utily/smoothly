// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Event, EventEmitter, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-popup",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPopup {
	@Prop({ mutable: true, reflect: true }) visible = false
	@Prop({ mutable: true, reflect: true }) direction: "up" | "down" = "down"
	@Event() popup: EventEmitter<boolean>

	private onClick() {
		this.visible = !this.visible
		this.popup.emit(this.visible)
	}
	render() {
		return (
			<Host>
				<content class="pointer" onClick={() => this.onClick()}>
					<slot></slot>
				</content>
				<div class="background" onClick={() => this.onClick()}></div>
				<div class="arrow" onClick={() => this.onClick()}></div>
				<aside>
					<slot name="popup"></slot>
				</aside>
			</Host>
		)
	}
}
