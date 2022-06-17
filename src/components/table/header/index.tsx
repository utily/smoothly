import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-table-header",
	styleUrl: "style.css",
	scoped: true,
})
export class TableHeader {
	render() {
		return <slot></slot>
	}
}
