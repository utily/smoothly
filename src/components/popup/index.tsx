// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Event, EventEmitter, h, Host, Prop, State } from "@stencil/core"

@Component({
	tag: "smoothly-popup",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPopup {
	@Prop({ mutable: true, reflect: true }) visible = false
	@Prop({ mutable: true, reflect: true }) direction: "up" | "down" = "down"
	@State() cssVariables: { "--left"?: string; "--right"?: string } = { "--left": "0.1em" }
	@Event() popup: EventEmitter<boolean>
	private popupElement: HTMLElement | undefined

	private onClick() {
		if (this.visible == false) {
			this.popupElement?.style.setProperty("display", "block")
			this.cssVariables =
				(this.popupElement?.getBoundingClientRect().right ?? 0) >= window.innerWidth
					? { "--right": "0.1em" }
					: (this.popupElement?.getBoundingClientRect().left ?? 0) < 0
					? { "--left": "0.1em" }
					: this.cssVariables
			this.popupElement?.style.removeProperty("display")
		}
		this.visible = !this.visible
		this.popup.emit(this.visible)
	}
	render() {
		return (
			<Host style={{ ...this.cssVariables }}>
				<div class="pointer" onClick={() => this.onClick()}>
					<slot></slot>
				</div>
				<div class="background" onClick={() => this.onClick()}></div>
				<div class="arrow" onClick={() => this.onClick()}></div>
				<div class="popup" ref={el => (this.popupElement = el)}>
					<slot name="popup"></slot>
				</div>
			</Host>
		)
	}
}
