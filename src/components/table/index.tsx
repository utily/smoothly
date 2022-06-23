import { Component, Element, Event, EventEmitter, h } from "@stencil/core"

@Component({
	tag: "smoothly-table",
	styleUrl: "style.css",
	scoped: true,
})
export class Table {
	@Element() element: HTMLSmoothlyTableElement
	@Event() loadMore: EventEmitter<void>
	render() {
		return [<slot></slot>]
	}
}
