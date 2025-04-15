import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableDemo {
	render(): VNode | VNode[] {
		return (
			<Host>
				{/* <smoothly-table-demo-filler-row /> */}
				{/* <smoothly-table-demo-group /> */}
				{/* <smoothly-table-demo-colspan /> */}
				<smoothly-table-demo-simple />
				<smoothly-table-demo-nested />
				{/* <smoothly-table-demo-filtered /> */}
			</Host>
		)
	}
}
