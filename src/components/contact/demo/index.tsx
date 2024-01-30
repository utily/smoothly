import { Component, h, Host } from "@stencil/core"
@Component({
	tag: "smoothly-contact-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyContactDemo {
	render() {
		return (
			<Host>
				<smoothly-address-display />
				<smoothly-contact-display />
			</Host>
		)
	}
}
