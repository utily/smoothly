import { FunctionalComponent, h } from "@stencil/core"

interface SmoothlyTableFunctionalExpandableProps {
	title?: string
	onSmoothlyTableFunctionalExpandableCellOpen?: (event: CustomEvent<boolean>) => void
}

export const SmoothlyTableFunctionalExpandableCell: FunctionalComponent<SmoothlyTableFunctionalExpandableProps> = (
	{ title, onSmoothlyTableFunctionalExpandableCellOpen },
	children
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
			onSmoothlyTableFunctionalExpandableCellOpen?.(newEvent)
		}
	}
	return (
		<div class="smoothly-table-functional-cell" title={title} onClick={e => toggleOpen(e)}>
			{children.slice(0, children.length - 1)}
			<div class="smoothly-table-functional-row-detail" ref={el => (detailElement = el)}>
				{children.at(-1)} {/* assumes last element is details since functional components cant have slots */}
			</div>
		</div>
	)
}
