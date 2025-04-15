import { FunctionalComponent, h } from "@stencil/core"

export const RowFunctional: FunctionalComponent = (props, children) => {
	return <div class="smoothly-table-functional-row">{children}</div>
}
