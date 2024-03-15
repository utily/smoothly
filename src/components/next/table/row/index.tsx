import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-table-row",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTableRow {
	render(): VNode | VNode[] {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
