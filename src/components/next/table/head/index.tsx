import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-table-head",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTable {
	render(): VNode | VNode[] {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
