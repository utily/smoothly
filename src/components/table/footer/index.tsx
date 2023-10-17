import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-table-footer",
	styleUrl: "style.css",
	scoped: true,
})
export class TableFooter {
	render() {
		return (
			<div>
				<slot />
			</div>
		)
	}
}
