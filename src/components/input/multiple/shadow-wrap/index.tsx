import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "shadow-wrap",
	styleUrl: "style.css",
	shadow: true,
})
export class ShadowWrap {
	render() {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
