import { Component, h, Listen, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-burger",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyBurger {
	@Prop({ mutable: true, reflect: true }) visible: boolean
	@Prop({ reflect: true }) mediaQuery = "(max-width: 900px)"

	@Listen("resize", { target: "window" })
	resizeHandler() {
		const reduced = window.matchMedia(this.mediaQuery).matches
		if (reduced)
			this.visible = true
		else
			this.visible = false
	}

	render() {
		return (
			<span>
				<div class="slide"></div>
				<div class="slide"></div>
				<div class="slide"></div>
			</span>
		)
	}
}
