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
				<div>
					<slot></slot>
					<smoothly-icon name="chevron-forward" size="tiny" />
				</div>
			</Host>
		)
	}
}
