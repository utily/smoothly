import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-functional-body",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyTableFunctionalBody {
	render(): VNode | VNode[] {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
