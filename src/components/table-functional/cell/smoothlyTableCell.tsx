import { FunctionalComponent, h } from "@stencil/core"

interface SmoothlyTableFunctionalProps {
	title?: string
}

export const SmoothlyTableFunctionalCell: FunctionalComponent<SmoothlyTableFunctionalProps> = ({ title }, children) => {
	return (
		<div class="smoothly-table-functional-cell" title={title}>
			{children}
		</div>
	)
}
