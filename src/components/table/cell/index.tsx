import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-table-cell",
	styleUrl: "style.css",
	scoped: true,
})
export class TableCell {
	render() {
		return (
			<Host>
				<slot></slot>
			</Host>
		)
	}
}
