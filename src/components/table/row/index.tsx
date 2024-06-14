import { Component, Element, h, Listen } from "@stencil/core"

@Component({
	tag: "smoothly-0-table-row",
	styleUrl: "style.css",
	scoped: true,
})
export class TableRow {
	@Element() element: HTMLSmoothly0TableRowElement
	expansions: HTMLSmoothly0TableExpandableCellElement[] = []
	@Listen("expansionLoad")
	onExpansionLoad(event: CustomEvent<void>) {
		this.expansions.push(event.target as HTMLSmoothly0TableExpandableCellElement)
	}
	@Listen("expansionOpen")
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
