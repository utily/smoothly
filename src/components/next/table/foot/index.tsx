import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-table-foot",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTableFoot {
	render(): VNode | VNode[] {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
