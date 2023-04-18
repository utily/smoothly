import { Component, Element, h, Listen } from "@stencil/core"

@Component({
	tag: "smoothly-table-row",
	styleUrl: "style.css",
	scoped: true,
})
export class TableRow {
	@Element() element: HTMLSmoothlyTableRowElement
	expansions: HTMLSmoothlyTableExpandableCellElement[] = []
	@Listen("smoothlyExpansionLoad")
	onExpansionLoad(event: CustomEvent<void>) {
		this.expansions.push(event.target as HTMLSmoothlyTableExpandableCellElement)
	}
	@Listen("smoothlyExpansionOpen")
	onExpansionOpen(event: CustomEvent<HTMLElement | undefined>) {
		this.expansions.forEach(cell => {
			if (cell != event.target)
				cell.open = false
		})
		if (event.detail)
			this.element.after(event.detail)
	}
	render() {
		return <slot></slot>
	}
}
