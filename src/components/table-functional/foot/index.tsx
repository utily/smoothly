import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-functional-foot",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyTableShadowFoot {
	render(): VNode | VNode[] {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
