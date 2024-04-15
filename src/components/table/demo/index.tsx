import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-table-demo",
	styleUrl: "style.css",
	shadow: true,
})
export class TableDemo {
	render() {
		return (
			<Host>
				<h4>Demo Filter</h4> <smoothly-filter-demo />
				<h4>Demo table 1: Filtered & Checked Table</h4> <smoothly-lazy content={<smoothly-table-demo-filtered />} />
				<h4>Demo table 2</h4> <smoothly-table-testing></smoothly-table-testing> <h4>Demo table 3</h4>
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
				</smoothly-table>
				<h4>Demo table 4</h4>
				<smoothly-table>
					<smoothly-table-row>
						<smoothly-table-header>Header A</smoothly-table-header>
						<smoothly-table-expandable-cell>
							Header expansion
							<div slot="detail">Expansion content</div>
						</smoothly-table-expandable-cell>
					</smoothly-table-row>
					<smoothly-table-expandable-row>
						<smoothly-table-cell>A Content</smoothly-table-cell>
						<smoothly-table-cell>Expansion cell</smoothly-table-cell>
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
					<smoothly-table-row>
						<smoothly-table-cell>A Content</smoothly-table-cell>
						<smoothly-table-expandable-cell>
							Expandable cell
							<div slot="detail">Expansion content</div>
						</smoothly-table-expandable-cell>
					</smoothly-table-row>
				</smoothly-table>
				<h4>Demo table 5</h4>
				<smoothly-table>
					<smoothly-table-row>
						<smoothly-table-header>A</smoothly-table-header>
						<smoothly-table-header>B</smoothly-table-header>
					</smoothly-table-row>
					<smoothly-table-expandable-row>
						<smoothly-table-cell>nested expandable row</smoothly-table-cell>
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
							<span>nested expandable cells</span>
							<div slot="detail">
								<smoothly-table>
									<smoothly-table-row>
										<smoothly-table-header>E</smoothly-table-header>
										<smoothly-table-header>F</smoothly-table-header>
									</smoothly-table-row>
									<smoothly-table-row>
										<smoothly-table-expandable-cell>
											e cell
											<div slot="detail">
												<smoothly-table>
													<smoothly-table-row>
														<smoothly-table-header>G</smoothly-table-header>
														<smoothly-table-header>H</smoothly-table-header>
													</smoothly-table-row>
													<smoothly-table-row>
														<smoothly-table-expandable-cell>
															g cell
															<div slot="detail">nested expandable cell expansion g</div>
														</smoothly-table-expandable-cell>
														<smoothly-table-expandable-cell>
															h cell
															<div slot="detail">nested expandable cell expansion h</div>
														</smoothly-table-expandable-cell>
													</smoothly-table-row>
												</smoothly-table>
											</div>
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
				</smoothly-table>
				<h4>Demo table 6</h4>
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
				</smoothly-table>
				<h4>Demo table 7</h4> <span>nested 1 then normal</span>
				<smoothly-table>
					<smoothly-table-row>
						<smoothly-table-header>A</smoothly-table-header>
						<smoothly-table-header>B</smoothly-table-header>
					</smoothly-table-row>
					<smoothly-table-expandable-row>
						<smoothly-table-cell>a</smoothly-table-cell>
						<smoothly-table-cell>b</smoothly-table-cell>
						<div slot="detail">
							<smoothly-table>
								<smoothly-table-row>
									<smoothly-table-header>C</smoothly-table-header>
									<smoothly-table-header>D</smoothly-table-header>
								</smoothly-table-row>
								<smoothly-table-row>
									<smoothly-table-cell>c</smoothly-table-cell>
									<smoothly-table-cell>d</smoothly-table-cell>
								</smoothly-table-row>
								<smoothly-table-row>
									<smoothly-table-cell>ccc</smoothly-table-cell>
									<smoothly-table-cell>ddd</smoothly-table-cell>
								</smoothly-table-row>
								<smoothly-table-expandable-row>
									<smoothly-table-cell>cccc</smoothly-table-cell>
									<smoothly-table-cell>dddd</smoothly-table-cell>
									<div slot="detail">CONTENT</div>
								</smoothly-table-expandable-row>
								<smoothly-table-row>
									<smoothly-table-cell>ccccc</smoothly-table-cell>
									<smoothly-table-cell>ddd</smoothly-table-cell>
								</smoothly-table-row>
								<smoothly-table-expandable-row>
									<smoothly-table-cell>cccc</smoothly-table-cell>
									<smoothly-table-cell>dddd</smoothly-table-cell>
									<div slot="detail">CONTENT</div>
								</smoothly-table-expandable-row>
							</smoothly-table>
						</div>
					</smoothly-table-expandable-row>
				</smoothly-table>
				<h4>Demo table 8</h4> <span>not nested</span>
				<smoothly-table>
					<smoothly-table-row>
						<smoothly-table-header>C</smoothly-table-header>
						<smoothly-table-header>D</smoothly-table-header>
					</smoothly-table-row>
					<smoothly-table-row>
						<smoothly-table-cell>c</smoothly-table-cell>
						<smoothly-table-cell>d</smoothly-table-cell>
					</smoothly-table-row>
					<smoothly-table-row>
						<smoothly-table-cell>cc</smoothly-table-cell>
						<smoothly-table-cell>dd</smoothly-table-cell>
					</smoothly-table-row>
					<smoothly-table-row>
						<smoothly-table-cell>ccc</smoothly-table-cell>
						<smoothly-table-cell>ddd</smoothly-table-cell>
					</smoothly-table-row>
				</smoothly-table>
				<h4>Demo table 9</h4>
				<smoothly-table>
					<smoothly-table-row>
						<smoothly-table-header>First name</smoothly-table-header>
						<smoothly-table-header>Last name</smoothly-table-header>
						<smoothly-table-header style={{ width: "1px" }}>
							<smoothly-icon name="alert-outline" />
						</smoothly-table-header>
					</smoothly-table-row>
					<smoothly-table-expandable-row>
						<smoothly-table-cell>Jessie</smoothly-table-cell>
						<smoothly-table-cell>Doe</smoothly-table-cell>
						<smoothly-table-cell></smoothly-table-cell>
						<div slot="detail">
							<p>This is Jessie</p>
						</div>
					</smoothly-table-expandable-row>
				</smoothly-table>
				<h4>Demo table 9 - Lazy expansion rows</h4>
				<smoothly-table>
					<smoothly-table-row>
						<smoothly-table-header>Company</smoothly-table-header>
					</smoothly-table-row>
					<smoothly-table-expandable-row>
						<smoothly-table-cell>Proquse</smoothly-table-cell>
						<smoothly-lazy
							slot={"detail"}
							content={<img src={"https://brand.proquse.com/logo/proquse-black.svg"} alt={"Proquse Logotype."} />}
						/>
					</smoothly-table-expandable-row>
					<smoothly-table-expandable-row>
						<smoothly-table-cell>Pax2Pay</smoothly-table-cell>
						<smoothly-lazy
							slot={"detail"}
							content={() => (
								<img src={"https://dash.pax2pay.app/assets/pax2pay-dark-horizontal.svg"} alt={"Pax2Pay Logotype."} />
							)}
						/>
					</smoothly-table-expandable-row>
				</smoothly-table>
				<h4>Demo table 10 - Lazy expansion cells</h4>
				<smoothly-table>
					<smoothly-table-row>
						<smoothly-table-header>Company</smoothly-table-header>
					</smoothly-table-row>
					<smoothly-table-row>
						<smoothly-table-expandable-cell>
							Proquse
							<smoothly-lazy
								slot={"detail"}
								content={<img src={"https://brand.proquse.com/logo/proquse-black.svg"} alt={"Proquse Logotype."} />}
							/>
						</smoothly-table-expandable-cell>
					</smoothly-table-row>
					<smoothly-table-row>
						<smoothly-table-expandable-cell>
							Pax2Pay
							<smoothly-lazy
								slot={"detail"}
								content={() => (
									<img src={"https://dash.pax2pay.app/assets/pax2pay-dark-horizontal.svg"} alt={"Pax2Pay Logotype."} />
								)}
							/>
						</smoothly-table-expandable-cell>
					</smoothly-table-row>
				</smoothly-table>
			</Host>
		)
	}
}
