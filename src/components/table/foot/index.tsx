import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-foot",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableFoot {
	render(): VNode | VNode[] {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
