import { Component, Element, h } from "@stencil/core"

@Component({
	tag: "smoothly-table",
	styleUrl: "style.css",
	scoped: true,
})
export class Table {
	@Element() element: HTMLSmoothlyTableElement
	render() {
		return [<slot></slot>]
	}
}
