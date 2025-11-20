import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-burger",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyBurger {
	@Element() element: HTMLSmoothlyBurgerElement
	@Prop({ mutable: true, reflect: true }) visible: boolean
	@Prop({ mutable: true, reflect: true }) open = false
	@Prop({ reflect: true }) mediaQuery = "(max-width: 900px)"
	@State() history: boolean
	@Event() smoothlyNavStatus: EventEmitter<boolean>

	componentWillLoad() {
		// this.history = window.matchMedia(this.mediaQuery).matches
		// if (!window.matchMedia(this.mediaQuery).matches)
		// 	this.visible = false
		// else
		// 	this.visible = true
		// this.smoothlyNavStatus.emit(!this.visible)
		// this.smoothlyVisibleStatus.emit(this.visible)
	}

	@Method()
	setMobileMode(mobile: boolean): void {
		this.visible = mobile
	}

	@Watch("open")
	openChanged() {
		this.smoothlyNavStatus.emit(this.open)
	}

	@Listen("click")
	clickHandler() {
		if (this.visible)
			this.open = !this.open
	}

	// @Listen("resize", { target: "window" })
	// resizeHandler() {
	// 	const result = window.matchMedia(this.mediaQuery).matches
	// 	if (result != this.history) {
	// 		if (result) {
	// 			this.visible = true
	// 			this.open = false
	// 		} else {
	// 			this.visible = false
	// 			this.open = false
	// 		}
	// 		this.smoothlyVisibleStatus.emit(this.visible)
	// 		this.smoothlyNavStatus.emit(!this.visible)
	// 	}
	// 	this.history = result
	// }

	render() {
		return (
			<Host>
				<span class="burger">
					<smoothly-icon name="menu" />
				</span>
			</Host>
		)
	}
}
