import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-burger",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyBurger {
	@Element() element: HTMLSmoothlyBurgerElement
	@Prop({ reflect: true, mutable: true }) open = false
	@Event() smoothlyNavStatus: EventEmitter<boolean>

	@Watch("open")
	openChanged() {
		this.smoothlyNavStatus.emit(this.open)
	}

	@Listen("click")
	clickHandler() {
		this.open = !this.open
	}

	render() {
		return (
			<Host>
				<smoothly-icon name="menu" />
			</Host>
		)
	}
}
