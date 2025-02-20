import { Component, h, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-table-filler-row",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTableFillerRow {

	render(): VNode | VNode[] {
		return (
			<smoothly-next-table-row>
				<smoothly-next-table-cell>
					<slot />
				</smoothly-next-table-cell>
			</smoothly-next-table-row>
		)
	}
}
