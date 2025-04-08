import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-shadow-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableDemo {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-table-shadow-demo-filler-row />
				<smoothly-table-shadow-demo-group />
				<smoothly-table-shadow-demo-colspan />
				<smoothly-table-shadow-demo-simple />

				<smoothly-table-shadow-demo-filtered />
				<smoothly-table-shadow-demo-nested />
			</Host>
		)
	}
}
