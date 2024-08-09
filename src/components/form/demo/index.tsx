import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-form-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFormDemo {
	render(): VNode | VNode[] {
		return (
			<Host>
				<div>
					<smoothly-form-demo-typed />
				</div>
			</Host>
		)
	}
}
