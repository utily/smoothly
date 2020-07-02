import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-app",
	styleUrl: "style.css",
	scoped: false,
})
export class SmoothlyApp {
	render() {
		return [
			<slot></slot>,
		]
	}
}
