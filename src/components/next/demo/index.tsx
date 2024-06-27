import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextDemo {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-next-demo-simple />
				<smoothly-next-demo-nested />
			</Host>
		)
	}
}
