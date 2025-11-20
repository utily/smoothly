import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-burger",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyBurger {
	@Element() element: HTMLSmoothlyBurgerElement
	@Prop({ reflect: true, mutable: true }) open = false
	@State() visible: boolean
	@State() history: boolean
	@Event() smoothlyNavStatus: EventEmitter<boolean>

	@Method()
	setMobileMode(mobile: boolean): void {
		this.visible = mobile
		if (!mobile)
			this.open = false
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
			<Host class={{ "smoothly-burger-visible": this.visible }}>
				<smoothly-icon name="menu" />
			</Host>
		)
	}
}
