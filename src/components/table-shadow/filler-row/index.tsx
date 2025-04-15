import { Component, h, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-shadow-filler-row",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableShadowFillerRow {
	render(): VNode | VNode[] {
		return (
			<smoothly-table-row>
				<smoothly-table-cell>
					<slot />
				</smoothly-table-cell>
			</smoothly-table-row>
		)
	}
}
