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
	@State() history: boolean
	@Event() smoothlyNavStatus: EventEmitter<boolean>

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
