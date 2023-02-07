import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-burger",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyBurger {
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
