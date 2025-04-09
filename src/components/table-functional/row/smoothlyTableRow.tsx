import { FunctionalComponent, h, VNode } from "@stencil/core"

export const SmoothlyTableFunctionalRow: FunctionalComponent = (children: VNode[]) => {
	console.log("SmoothlyTableFunctionalRow", children)
	return <div class="smoothly-table-functional-row">{children}</div>
}
