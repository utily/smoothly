import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-table-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class TableDemo {
	render() {
		return [
			<smoothly-table>
				<smoothly-table-row>
					<smoothly-table-header>Header A</smoothly-table-header>
					<smoothly-table-header>Header B</smoothly-table-header>
					<smoothly-table-header>Header C</smoothly-table-header>
					<smoothly-table-header></smoothly-table-header>
				</smoothly-table-row>
				<smoothly-table-expandable-row>
					<smoothly-table-expandable-cell>
						Value 1A
						<div slot="detail">1A details</div>
					</smoothly-table-expandable-cell>
					<smoothly-table-expandable-cell>
						<smoothly-display type="price" value={20} currency="EUR"></smoothly-display>
						<div slot="detail">Budget details.</div>
					</smoothly-table-expandable-cell>
					<smoothly-table-expandable-cell>
						<smoothly-display type="price" value={18} currency="EUR"></smoothly-display>
						<div slot="detail">Cost details.</div>
					</smoothly-table-expandable-cell>
				</smoothly-table-expandable-row>

				<smoothly-table-expandable-row>
					<smoothly-table-expandable-cell>
						Expandable row (exp.cell)"
						<div slot="detail">expandable cell 1 content</div>
					</smoothly-table-expandable-cell>
					<smoothly-table-expandable-cell>
						expandable cell
						<div slot="detail">expandable cell 2 content</div>
					</smoothly-table-expandable-cell>
					<smoothly-table-expandable-cell>
						expandable cell
						<div slot="detail">expandable cell 3 content</div>
					</smoothly-table-expandable-cell>
					<smoothly-table-expandable-cell>
						expandable cell
						<div slot="detail">expandable cell 4 content</div>
					</smoothly-table-expandable-cell>
				</smoothly-table-expandable-row>

				<smoothly-table-expandable-row>
					<smoothly-table-cell>Expandable row (nor.cell)"</smoothly-table-cell>
					<smoothly-table-cell>normal cell</smoothly-table-cell>
					<smoothly-table-expandable-cell>
						expandable cell
						<div slot="detail">expandable cell details.</div>
					</smoothly-table-expandable-cell>
					<smoothly-table-expandable-cell>
						<smoothly-icon name="chevron-forward" size="tiny"></smoothly-icon>
					</smoothly-table-expandable-cell>
				</smoothly-table-expandable-row>

				<smoothly-table-row>
					<smoothly-table-cell>Normal row</smoothly-table-cell>
					<smoothly-table-cell>Normal cell</smoothly-table-cell>
					<smoothly-table-cell>
						<smoothly-display type="price" value={18} currency="EUR"></smoothly-display>
					</smoothly-table-cell>
				</smoothly-table-row>
			</smoothly-table>,
		]
	}
}
