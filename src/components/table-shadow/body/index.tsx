import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-shadow-body",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyTableShadowBody {
	render(): VNode | VNode[] {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
