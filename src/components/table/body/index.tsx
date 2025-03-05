import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-body",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableBody {
	render(): VNode | VNode[] {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
