import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-0-table-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class TableDemo {
	render() {
		return [
			<smoothly-0-table>
				<smoothly-0-table-row>
					<smoothly-0-table-header>Header A</smoothly-0-table-header>
					<smoothly-0-table-header>Header B</smoothly-0-table-header>
					<smoothly-0-table-header>Header C</smoothly-0-table-header>
					<smoothly-0-table-header>Header D</smoothly-0-table-header>
				</smoothly-0-table-row>
				<smoothly-0-table-row>
					<smoothly-0-table-expandable-cell open>
						normal row (exp.cell)
						<div slot="detail">expandable cell 1 content</div>
					</smoothly-0-table-expandable-cell>
					<smoothly-0-table-expandable-cell>
						expandable cell
						<div slot="detail">expandable cell 2 content</div>
					</smoothly-0-table-expandable-cell>
					<smoothly-0-table-expandable-cell>
						expandable cell
						<div slot="detail">expandable cell 3 content</div>
					</smoothly-0-table-expandable-cell>
					<smoothly-0-table-expandable-cell>
						expandable cell
						<div slot="detail">expandable cell 4 content</div>
					</smoothly-0-table-expandable-cell>
				</smoothly-0-table-row>

				<smoothly-0-table-row>
					<smoothly-0-table-cell>normal row (nor.cell)"</smoothly-0-table-cell>
					<smoothly-0-table-cell>normal cell</smoothly-0-table-cell>
					<smoothly-0-table-expandable-cell open>
						expandable cell
						<div slot="detail">expandable cell details.</div>
					</smoothly-0-table-expandable-cell>
					<smoothly-0-table-expandable-cell>
						expandable cell
						<div slot="detail">expandable cell details.</div>
					</smoothly-0-table-expandable-cell>
				</smoothly-0-table-row>

				<smoothly-0-table-expandable-row>
					<smoothly-0-table-cell>expandable row (nor.cell)</smoothly-0-table-cell>
					<smoothly-0-table-cell>Normal cell</smoothly-0-table-cell>
					<smoothly-0-table-cell>normal cell</smoothly-0-table-cell>
					<smoothly-0-table-cell>Normal cell</smoothly-0-table-cell>
					<div slot="detail">expandable row content</div>
				</smoothly-0-table-expandable-row>
			</smoothly-0-table>,
			<smoothly-0-table>
				<smoothly-0-table-row>
					<smoothly-0-table-header>Header A</smoothly-0-table-header>
				</smoothly-0-table-row>
				<smoothly-0-table-expandable-row>
					<smoothly-0-table-cell>A Content</smoothly-0-table-cell>
					<div slot="detail">
						<smoothly-0-tab-switch>
							<smoothly-0-tab label="innertable 1" open={true}>
								<smoothly-0-table>
									<smoothly-0-table-row>
										<smoothly-0-table-header>Header B</smoothly-0-table-header>
									</smoothly-0-table-row>
									<smoothly-0-table-expandable-row>B Content</smoothly-0-table-expandable-row>
								</smoothly-0-table>
							</smoothly-0-tab>
							<smoothly-0-tab label="innertable 2">
								<smoothly-0-table>
									<smoothly-0-table-row>
										<smoothly-0-table-header>Header C</smoothly-0-table-header>
									</smoothly-0-table-row>
									<smoothly-0-table-expandable-row>
										<smoothly-0-table-cell>C Content</smoothly-0-table-cell>
									</smoothly-0-table-expandable-row>
								</smoothly-0-table>
							</smoothly-0-tab>
						</smoothly-0-tab-switch>
					</div>
				</smoothly-0-table-expandable-row>
			</smoothly-0-table>,
			<smoothly-0-table>
				<smoothly-0-table-row>
					<smoothly-0-table-header>A</smoothly-0-table-header>
					<smoothly-0-table-header>B</smoothly-0-table-header>
				</smoothly-0-table-row>
				<smoothly-0-table-expandable-row>
					<smoothly-0-table-cell>a row</smoothly-0-table-cell>
					<smoothly-0-table-cell>b row</smoothly-0-table-cell>
					<div slot="detail">
						<smoothly-0-table>
							<smoothly-0-table-row>
								<smoothly-0-table-header>C</smoothly-0-table-header>
								<smoothly-0-table-header>D</smoothly-0-table-header>
							</smoothly-0-table-row>
							<smoothly-0-table-expandable-row>
								<smoothly-0-table-cell>c</smoothly-0-table-cell>
								<smoothly-0-table-cell>d</smoothly-0-table-cell>
								<div slot="detail">
									<smoothly-0-table>
										<smoothly-0-table-row>
											<smoothly-0-table-header>E</smoothly-0-table-header>
											<smoothly-0-table-header>F</smoothly-0-table-header>
										</smoothly-0-table-row>
										<smoothly-0-table-expandable-row>
											<smoothly-0-table-cell>e row</smoothly-0-table-cell>
											<smoothly-0-table-cell>f row</smoothly-0-table-cell>
											<div slot="detail">nested expandable row expansion e f</div>
										</smoothly-0-table-expandable-row>
									</smoothly-0-table>
								</div>
							</smoothly-0-table-expandable-row>
						</smoothly-0-table>
					</div>
				</smoothly-0-table-expandable-row>
				<smoothly-0-table-expandable-row>
					<smoothly-0-table-cell>
						<span>one</span>
						<span>two</span>
						<span>three</span>
					</smoothly-0-table-cell>
					<smoothly-0-table-cell>
						five<smoothly-0-icon name="paper-plane-sharp" size="small"></smoothly-0-icon>
					</smoothly-0-table-cell>
					<div slot="detail">four</div>
				</smoothly-0-table-expandable-row>
				<smoothly-0-table-row>
					<smoothly-0-table-expandable-cell>
						a cell
						<div slot="detail">
							<smoothly-0-table>
								<smoothly-0-table-row>
									<smoothly-0-table-header>E</smoothly-0-table-header>
									<smoothly-0-table-header>F</smoothly-0-table-header>
								</smoothly-0-table-row>
								<smoothly-0-table-row>
									<smoothly-0-table-expandable-cell>
										e cell
										<div slot="detail">nested expandable cell expansion e</div>
									</smoothly-0-table-expandable-cell>
									<smoothly-0-table-expandable-cell>
										f cell
										<div slot="detail">nested expandable cell expansion f</div>
									</smoothly-0-table-expandable-cell>
								</smoothly-0-table-row>
							</smoothly-0-table>
						</div>
					</smoothly-0-table-expandable-cell>
					<smoothly-0-table-expandable-cell>
						b cell
						<div slot="detail">
							<smoothly-0-table>
								<smoothly-0-table-row>
									<smoothly-0-table-header>C</smoothly-0-table-header>
									<smoothly-0-table-header>D</smoothly-0-table-header>
								</smoothly-0-table-row>
								<smoothly-0-table-row>
									<smoothly-0-table-expandable-cell>
										c cell
										<div slot="detail">nested expandable cell expansion c</div>
									</smoothly-0-table-expandable-cell>
									<smoothly-0-table-expandable-cell>
										d cell
										<div slot="detail">nested expandable cell expansion d</div>
									</smoothly-0-table-expandable-cell>
								</smoothly-0-table-row>
							</smoothly-0-table>
						</div>
					</smoothly-0-table-expandable-cell>
				</smoothly-0-table-row>
			</smoothly-0-table>,
			<smoothly-0-table>
				<smoothly-0-table-row>
					<smoothly-0-table-header>display</smoothly-0-table-header>
					<smoothly-0-table-header>contents</smoothly-0-table-header>
				</smoothly-0-table-row>
				<smoothly-0-table-expandable-row>
					<div class={"content"}>
						<smoothly-0-table-cell>A</smoothly-0-table-cell>
						<smoothly-0-table-cell>B</smoothly-0-table-cell>
					</div>
					<div slot="detail">expansion</div>
				</smoothly-0-table-expandable-row>
			</smoothly-0-table>,
		]
	}
}
