import { Component, Event, EventEmitter, h, Host, Listen, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-burger",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyBurger {
	@Prop({ mutable: true, reflect: true }) visible: boolean
	@Prop({ mutable: true, reflect: true }) open = true
	@Prop({ reflect: true }) mediaQuery = "(max-width: 900px)"
	@Event() burgerStatus: EventEmitter<boolean>

	@Watch("open")
	closedHandler() {
		this.burgerStatus.emit(this.open)
	}

	@Listen("resize", { target: "window" })
	resizeHandler() {
		const reduced = window.matchMedia(this.mediaQuery).matches
		if (reduced) {
			this.visible = true
			this.open = true
		} else {
			this.visible = false
			this.open = false
		}
	}

	render() {
		return (
			<Host>
				<span class="burger" onClick={() => (this.open = !this.open)}>
					<smoothly-icon name="menu"> </smoothly-icon>
				</span>
			</Host>
		)
	}
}
