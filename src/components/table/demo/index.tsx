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
					<smoothly-table-header>Header D</smoothly-table-header>
					<smoothly-table-header></smoothly-table-header>
				</smoothly-table-row>
				<smoothly-table-row>
					<smoothly-table-expandable-cell>
						normal row (exp.cell)
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
				</smoothly-table-row>

				<smoothly-table-row>
					<smoothly-table-cell>normal row (nor.cell)"</smoothly-table-cell>
					<smoothly-table-cell>normal cell</smoothly-table-cell>
					<smoothly-table-expandable-cell>
						expandable cell
						<div slot="detail">expandable cell details.</div>
					</smoothly-table-expandable-cell>
					<smoothly-table-expandable-cell>
						expandable cell
						<div slot="detail">expandable cell details.</div>
					</smoothly-table-expandable-cell>
				</smoothly-table-row>

				<smoothly-table-expandable-row>
					<smoothly-table-cell>expandable row (nor.cell)</smoothly-table-cell>
					<smoothly-table-cell>Normal cell</smoothly-table-cell>
					<smoothly-table-cell>normal cell</smoothly-table-cell>
					<smoothly-table-cell>Normal cell</smoothly-table-cell>
					<div slot="detail">expandable row content</div>
				</smoothly-table-expandable-row>
			</smoothly-table>,
			<smoothly-table>
				<smoothly-table-row>
					<smoothly-table-header>Header A</smoothly-table-header>
					<smoothly-table-header></smoothly-table-header>
				</smoothly-table-row>
				<smoothly-table-expandable-row>
					A Content
					<div slot="detail">
						<smoothly-tab-switch>
							<smoothly-tab label="1" open={true}>
								<smoothly-table>
									<smoothly-table-row>
										<smoothly-table-header>Header B</smoothly-table-header>
										<smoothly-table-header></smoothly-table-header>
									</smoothly-table-row>
									<smoothly-table-expandable-row>
										<smoothly-table-cell>B Content</smoothly-table-cell>
									</smoothly-table-expandable-row>
								</smoothly-table>
							</smoothly-tab>
						</smoothly-tab-switch>
					</div>
				</smoothly-table-expandable-row>
			</smoothly-table>,
		]
	}
}
