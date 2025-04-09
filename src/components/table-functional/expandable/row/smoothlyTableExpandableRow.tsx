import { FunctionalComponent, h, VNode } from "@stencil/core"

interface SmoothlyTableProps {
	onSmoothlyTableFunctionalExpandableRowOpen?: (event: CustomEvent<boolean>) => void
}

export const SmoothlyTableFunctionalExpandableRow: FunctionalComponent<SmoothlyTableProps> = (
	{ onSmoothlyTableFunctionalExpandableRowOpen },
	children: VNode[]
) => {
	let detailElement: HTMLElement | undefined

	const toggleOpen = (e: MouseEvent) => {
		if (e.composedPath().every(el => el != detailElement)) {
			const isOpen = !!detailElement?.classList.contains("smoothly-open")
			detailElement?.classList.toggle("smoothly-open")

			const newEvent = new CustomEvent<boolean>("smoothlyRowOpen", {
				detail: isOpen,
				bubbles: true,
				composed: true,
			})
			e.target?.dispatchEvent(newEvent)
			onSmoothlyTableFunctionalExpandableRowOpen?.(newEvent)
		}
	}

	return (
		<div class="smoothly-table-functional-row" onClick={e => toggleOpen(e)}>
			{children.slice(0, children.length - 1)}
			<div class="smoothly-table-functional-row-detail" ref={el => (detailElement = el)}>
				{children.at(-1)} {/* assumes last element is details since functional components cant have slots */}
			</div>
		</div>
	)
}
