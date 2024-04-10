import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-table-footer",
	styleUrl: "style.css",
	scoped: true,
})
export class TableFooter {
	@Prop() colSpan: number
	render() {
		return (
			<th colSpan={this.colSpan}>
				<slot />
			</th>
		)
	}
}
