import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-burger",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyBurger {
	@Prop({ mutable: true, reflect: true }) visible: boolean
	@Prop({ mutable: true, reflect: true }) open = false
	@Prop({ reflect: true }) mediaQuery = "(max-width: 900px)"
	@State() history: boolean
	@Event() navStatus: EventEmitter<boolean>

	componentWillLoad() {
		this.history = window.matchMedia(this.mediaQuery).matches
		if (!window.matchMedia(this.mediaQuery).matches) {
			this.visible = false
		} else {
			this.visible = true
		}
		this.navStatus.emit(!this.visible)
	}

	@Watch("open")
	openChanged() {
		this.navStatus.emit(this.open)
	}

	@Listen("resize", { target: "window" })
	resizeHandler() {
		const result = window.matchMedia(this.mediaQuery).matches
		if (result != this.history) {
			if (result) {
				this.visible = true
				this.open = false
			} else {
				this.visible = false
				this.open = false
			}
			this.navStatus.emit(!this.visible)
		}
		this.history = result
	}

	render() {
		return (
			<Host>
				<span class="burger" onClick={() => (this.open = !this.open)}>
					<smoothly-icon name="menu" />
				</span>
			</Host>
		)
	}
}
