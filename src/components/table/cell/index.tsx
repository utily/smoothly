import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-0-table-cell",
	styleUrl: "style.css",
	scoped: true,
})
export class TableCell {
	render() {
		return (
			<Host>
				<div>
					<div>
						<slot></slot>
					</div>
					<smoothly-0-icon name="chevron-forward" size="tiny" />
				</div>
			</Host>
		)
	}
}
