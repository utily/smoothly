import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-table-row",
	styleUrl: "style.css",
	scoped: true,
})
export class TableRow {
	render() {
		return (
			<Host>
				<slot></slot>
			</Host>
		)
	}
}
