import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-table-expandable-cell",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTableExpandableCell {
	render(): VNode | VNode[] {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
