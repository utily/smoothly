import { Component, Event, EventEmitter, h, Host, Listen, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-burger",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyBurger {
	@Prop({ mutable: true, reflect: true }) visible: boolean
	@Prop({ mutable: true, reflect: true }) closed = true
	@Prop({ reflect: true }) mediaQuery = "(max-width: 900px)"
	@Event() burgerStatus: EventEmitter<boolean>

	@Watch("closed")
	closedHandler() {
		this.burgerStatus.emit(this.closed)
	}

	@Listen("resize", { target: "window" })
	resizeHandler() {
		const reduced = window.matchMedia(this.mediaQuery).matches
		if (reduced)
			this.visible = true
		else {
			this.visible = false
			this.closed = true
		}
	}

	render() {
		return (
			<Host>
				<span class="burger" onClick={() => ((this.closed = !this.closed), console.log(this.closed))}>
					<div class="slide"></div>
					<div class="slide"></div>
					<div class="slide"></div>
				</span>
			</Host>
		)
	}
}
