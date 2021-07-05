import { Component, Element, Event, EventEmitter, h, Listen } from "@stencil/core"

@Component({
	tag: "smoothly-table",
	styleUrl: "style.css",
	scoped: true,
})
export class Table {
	@Element() element: HTMLSmoothlyTableElement
	@Event() loadMore: EventEmitter<void>
	sortedOn?: HTMLSmoothlyTableHeaderElement
	@Listen("sort")
	onSort(event: CustomEvent<{ property: string; direction: "ascending" | "descending" }>) {
		if (this.sortedOn && this.sortedOn != event.target)
			this.sortedOn.sortDirection = undefined
		this.sortedOn = event.target as HTMLSmoothlyTableHeaderElement
	}
	render() {
		return [<slot></slot>]
	}
}
