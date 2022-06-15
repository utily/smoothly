import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-table-header",
	styleUrl: "style.css",
	scoped: true,
})
export class TableHeader {
	render() {
		return (
			<Host>
				<slot></slot>
			</Host>
		)
	}
}
