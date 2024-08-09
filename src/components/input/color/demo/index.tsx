import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-input-color-demo",
	styles: "style.css",
})
export class SmoothlyInputColorDemo {
	render() {
		return (
			<Host>
				<h2>Color</h2>
				<smoothly-input-color name="color">Choose color</smoothly-input-color>
			</Host>
		)
	}
}
