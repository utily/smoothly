import { Component, Element, Event, EventEmitter, h, Listen } from "@stencil/core"

@Component({
	tag: "smoothly-table",
	styleUrl: "style.css",
	scoped: true,
})
export class Table {
	@Element() element: HTMLSmoothlyTableElement
	@Event() loadMore: EventEmitter<void>
	@Listen("expansionLoad")
	@Listen("expansionOpen")
	handleEvents(event: Event) {
		event.stopPropagation()
	}
	render() {
		return [<slot></slot>]
	}
}
