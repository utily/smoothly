import { Component, h, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-filler-row",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableFillerRow {
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
