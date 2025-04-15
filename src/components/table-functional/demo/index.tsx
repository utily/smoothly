import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-functional-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableDemo {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-table-functional-demo-nested />
			</Host>
		)
	}
}
