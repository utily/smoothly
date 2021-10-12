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
						Value 1A
						<div slot="detail">2A details</div>
					</smoothly-table-expandable-cell>
					<smoothly-table-expandable-cell>
						<smoothly-display type="price" value={30} currency="EUR"></smoothly-display>
						<div slot="detail">Budget details.</div>
					</smoothly-table-expandable-cell>
					<smoothly-table-expandable-cell>
						<smoothly-display type="price" value={38} currency="EUR"></smoothly-display>
						<div slot="detail">Cost details.</div>
					</smoothly-table-expandable-cell>
				</smoothly-table-expandable-row>
			</smoothly-table>,
			<smoothly-table>
				<smoothly-table-row>
					<smoothly-table-header>Header D</smoothly-table-header>
					<smoothly-table-header>Header E</smoothly-table-header>
					<smoothly-table-header>Header F</smoothly-table-header>
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
			</smoothly-table>,
		]
	}
}
