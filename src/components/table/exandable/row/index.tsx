import { Component, Element, h, Host, Listen } from "@stencil/core"

@Component({
	tag: "smoothly-table-expandable-row",
	styleUrl: "style.css",
	scoped: true,
})
export class TableExpandableRow {
	@Element() element: HTMLSmoothlyTableExpandableRowElement
	expansions: HTMLSmoothlyTableExpandableCellElement[] = []
	@Listen("expansionLoaded")
	onExpansionLoaded(event: CustomEvent<void>) {
		this.expansions.push(event.target as HTMLSmoothlyTableExpandableCellElement)
	}
	@Listen("expansionOpen")
	onDetailsLoaded(event: CustomEvent<HTMLElement | undefined>) {
		this.expansions.forEach(cell => {
			if (cell != event.target)
				cell.open = false
		})
		if (event.detail)
			this.element.after(event.detail)
	}
	render() {
		return (
			<Host>
				<slot></slot>
			</Host>
		)
	}
}
