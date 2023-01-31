import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-table-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class TableDemo {
	render() {
		return [
			<h2>Checked Table</h2>,
			<smoothly-table-demo-checked></smoothly-table-demo-checked>,
			<h2>Filtered Table</h2>,
			<smoothly-table-demo-filtered></smoothly-table-demo-filtered>,
			<smoothly-table>
				<smoothly-table-row>
					<smoothly-table-header>Header A</smoothly-table-header>
					<smoothly-table-header>Header B</smoothly-table-header>
					<smoothly-table-header>Header C</smoothly-table-header>
					<smoothly-table-header>Header D</smoothly-table-header>
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
				</smoothly-table-row>
				<smoothly-table-expandable-row>
					<smoothly-table-cell>A Content</smoothly-table-cell>
					<div slot="detail">
						<smoothly-tab-switch>
							<smoothly-tab label="innertable 1" open={true}>
								<smoothly-table>
									<smoothly-table-row>
										<smoothly-table-header>Header B</smoothly-table-header>
									</smoothly-table-row>
									<smoothly-table-expandable-row>B Content</smoothly-table-expandable-row>
								</smoothly-table>
							</smoothly-tab>
							<smoothly-tab label="innertable 2">
								<smoothly-table>
									<smoothly-table-row>
										<smoothly-table-header>Header C</smoothly-table-header>
									</smoothly-table-row>
									<smoothly-table-expandable-row>
										<smoothly-table-cell>C Content</smoothly-table-cell>
									</smoothly-table-expandable-row>
								</smoothly-table>
							</smoothly-tab>
						</smoothly-tab-switch>
					</div>
				</smoothly-table-expandable-row>
			</smoothly-table>,
			<smoothly-table>
				<smoothly-table-row>
					<smoothly-table-header>A</smoothly-table-header>
					<smoothly-table-header>B</smoothly-table-header>
				</smoothly-table-row>
				<smoothly-table-expandable-row>
					<smoothly-table-cell>a row</smoothly-table-cell>
					<smoothly-table-cell>b row</smoothly-table-cell>
					<div slot="detail">
						<smoothly-table>
							<smoothly-table-row>
								<smoothly-table-header>C</smoothly-table-header>
								<smoothly-table-header>D</smoothly-table-header>
							</smoothly-table-row>
							<smoothly-table-expandable-row>
								<smoothly-table-cell>c</smoothly-table-cell>
								<smoothly-table-cell>d</smoothly-table-cell>
								<div slot="detail">
									<smoothly-table>
										<smoothly-table-row>
											<smoothly-table-header>E</smoothly-table-header>
											<smoothly-table-header>F</smoothly-table-header>
										</smoothly-table-row>
										<smoothly-table-expandable-row>
											<smoothly-table-cell>e row</smoothly-table-cell>
											<smoothly-table-cell>f row</smoothly-table-cell>
											<div slot="detail">nested expandable row expansion e f</div>
										</smoothly-table-expandable-row>
									</smoothly-table>
								</div>
							</smoothly-table-expandable-row>
						</smoothly-table>
					</div>
				</smoothly-table-expandable-row>
				<smoothly-table-expandable-row>
					<smoothly-table-cell>
						<span>one</span>
						<span>two</span>
						<span>three</span>
					</smoothly-table-cell>
					<smoothly-table-cell>
						five<smoothly-icon name="paper-plane-sharp" size="small"></smoothly-icon>
					</smoothly-table-cell>
					<div slot="detail">four</div>
				</smoothly-table-expandable-row>
				<smoothly-table-row>
					<smoothly-table-expandable-cell>
						a cell
						<div slot="detail">
							<smoothly-table>
								<smoothly-table-row>
									<smoothly-table-header>E</smoothly-table-header>
									<smoothly-table-header>F</smoothly-table-header>
								</smoothly-table-row>
								<smoothly-table-row>
									<smoothly-table-expandable-cell>
										e cell
										<div slot="detail">nested expandable cell expansion e</div>
									</smoothly-table-expandable-cell>
									<smoothly-table-expandable-cell>
										f cell
										<div slot="detail">nested expandable cell expansion f</div>
									</smoothly-table-expandable-cell>
								</smoothly-table-row>
							</smoothly-table>
						</div>
					</smoothly-table-expandable-cell>
					<smoothly-table-expandable-cell>
						b cell
						<div slot="detail">
							<smoothly-table>
								<smoothly-table-row>
									<smoothly-table-header>C</smoothly-table-header>
									<smoothly-table-header>D</smoothly-table-header>
								</smoothly-table-row>
								<smoothly-table-row>
									<smoothly-table-expandable-cell>
										c cell
										<div slot="detail">nested expandable cell expansion c</div>
									</smoothly-table-expandable-cell>
									<smoothly-table-expandable-cell>
										d cell
										<div slot="detail">nested expandable cell expansion d</div>
									</smoothly-table-expandable-cell>
								</smoothly-table-row>
							</smoothly-table>
						</div>
					</smoothly-table-expandable-cell>
				</smoothly-table-row>
			</smoothly-table>,
			<smoothly-table>
				<smoothly-table-row>
					<smoothly-table-header>display</smoothly-table-header>
					<smoothly-table-header>contents</smoothly-table-header>
				</smoothly-table-row>
				<smoothly-table-expandable-row>
					<div class={"content"}>
						<smoothly-table-cell>A</smoothly-table-cell>
						<smoothly-table-cell>B</smoothly-table-cell>
					</div>
					<div slot="detail">expansion</div>
				</smoothly-table-expandable-row>
			</smoothly-table>,
		]
	}
}
