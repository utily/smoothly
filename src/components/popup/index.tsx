// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Event, EventEmitter, h, Host, Prop, State } from "@stencil/core"

@Component({
	tag: "smoothly-0-popup",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPopup {
	@Prop({ mutable: true, reflect: true }) visible = false
	@Prop({ mutable: true, reflect: true }) direction: "up" | "down" = "down"
	@State() cssVariables: { "--left"?: string; "--right"?: string } = { "--left": "0.1em" }
	@Event() popup: EventEmitter<boolean>
	private aside: HTMLElement | undefined

	private onClick() {
		if (this.visible == false) {
			this.aside?.style.setProperty("display", "block")
			this.cssVariables =
				(this.aside?.getBoundingClientRect().right ?? 0) >= window.innerWidth
					? { "--right": "0.1em" }
					: (this.aside?.getBoundingClientRect().left ?? 0) < 0
					? { "--left": "0.1em" }
					: this.cssVariables
			this.aside?.style.removeProperty("display")
		}
		this.visible = !this.visible
		this.popup.emit(this.visible)
	}
	render() {
		return (
			<Host style={{ ...this.cssVariables }}>
				<content class="pointer" onClick={() => this.onClick()}>
					<slot></slot>
				</content>
				<div class="background" onClick={() => this.onClick()}></div>
				<div class="arrow" onClick={() => this.onClick()}></div>
				<aside ref={el => (this.aside = el)}>
					<slot name="popup"></slot>
				</aside>
			</Host>
		)
	}
}
