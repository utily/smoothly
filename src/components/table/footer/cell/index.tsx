import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-table-footer-cell",
	styleUrl: "style.css",
	scoped: true,
})
export class TableFooterCell {
	render() {
		return (
			<Host>
				<div>
					<div>
						<slot />
					</div>
				</div>
			</Host>
		)
	}
}
