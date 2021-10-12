import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-table-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class TableDemo {
	render() {
		return (
			<smoothly-table>
				<smoothly-table-row>
					<smoothly-table-header>Header A</smoothly-table-header>
					<smoothly-table-header>Header B</smoothly-table-header>
					<smoothly-table-header>Header C</smoothly-table-header>
				</smoothly-table-row>
				<smoothly-table-row>
					<smoothly-table-cell>Value 1A</smoothly-table-cell>
					<smoothly-table-cell>
						<smoothly-display type="price" value={20} currency="EUR"></smoothly-display>
					</smoothly-table-cell>
					<smoothly-table-cell>
						<smoothly-display type="price" value={18} currency="EUR"></smoothly-display>
					</smoothly-table-cell>
					<div slot="detail">Cost details.</div>
				</smoothly-table-row>
				<smoothly-table-row>
					<smoothly-table-cell>Value 1A</smoothly-table-cell>
					<smoothly-table-cell>
						<smoothly-display type="price" value={20} currency="EUR"></smoothly-display>
					</smoothly-table-cell>
					<smoothly-table-cell>
						<smoothly-display type="price" value={18} currency="EUR"></smoothly-display>
					</smoothly-table-cell>
					<div slot="detail">Cost details.</div>
				</smoothly-table-row>
			</smoothly-table>
		)
	}
}
