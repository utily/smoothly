import { Component, Fragment, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-demo-group",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextDemoGroup {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-display type="text" value="Group" />
				<smoothly-next-table columns={2}>
					<smoothly-next-table-head>
						<smoothly-next-table-row>
							<smoothly-next-table-cell>Date</smoothly-next-table-cell>
							<smoothly-next-table-cell>Total</smoothly-next-table-cell>
						</smoothly-next-table-row>
					</smoothly-next-table-head>
					<smoothly-next-table-row-group align>
						<smoothly-display slot={"start"} type="date" value={"2024-01-01"} />
						<smoothly-display slot={"end"} type={"price"} currency={"EUR"} value={510} />
						<smoothly-next-table-expandable-row>
							<smoothly-next-table-cell>
								<smoothly-display type={"date-time"} value={"2024-01-01T01:37:00.000Z"} />
							</smoothly-next-table-cell>
							<smoothly-next-table-cell>
								<smoothly-display type={"price"} currency={"EUR"} value={250} />
							</smoothly-next-table-cell>
							<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-01T01:37:00.000Z</Fragment>} />
						</smoothly-next-table-expandable-row>
						<smoothly-next-table-expandable-row>
							<smoothly-next-table-cell>
								<smoothly-display type={"date-time"} value={"2024-01-01T13:37:00.000Z"} />
							</smoothly-next-table-cell>
							<smoothly-next-table-cell>
								<smoothly-display type={"price"} currency={"EUR"} value={260} />
							</smoothly-next-table-cell>
							<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-01T13:37:00.000Z</Fragment>} />
						</smoothly-next-table-expandable-row>
					</smoothly-next-table-row-group>
					<smoothly-next-table-body>
						<smoothly-next-table-row>
							<smoothly-next-table-cell>
								<smoothly-display type={"date"} value={"2024-01-02"} />
							</smoothly-next-table-cell>
							<smoothly-next-table-cell>
								<smoothly-display type={"price"} currency={"EUR"} value={130} />
							</smoothly-next-table-cell>
						</smoothly-next-table-row>
					</smoothly-next-table-body>
					<smoothly-next-table-row-group>
						<smoothly-display slot={"start"} type={"date"} value={"2024-01-03"} />
						<smoothly-display slot={"end"} type={"price"} currency={"EUR"} value={720} />
						<smoothly-next-table-expandable-row>
							<smoothly-next-table-cell>
								<smoothly-display type={"date-time"} value={"2024-01-03T01:37:00.000Z"} />
							</smoothly-next-table-cell>
							<smoothly-next-table-cell>
								<smoothly-display type={"price"} currency={"EUR"} value={320} />
							</smoothly-next-table-cell>
							<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-03T01:37:00.000Z</Fragment>} />
						</smoothly-next-table-expandable-row>
						<smoothly-next-table-expandable-row>
							<smoothly-next-table-cell>
								<smoothly-display type={"date-time"} value={"2024-01-03T13:37:00.000Z"} />
							</smoothly-next-table-cell>
							<smoothly-next-table-cell>
								<smoothly-display type={"price"} currency={"EUR"} value={400} />
							</smoothly-next-table-cell>
							<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-03T13:37:00.000Z</Fragment>} />
						</smoothly-next-table-expandable-row>
					</smoothly-next-table-row-group>
					<smoothly-next-table-row-group>
						<smoothly-display slot={"start"} type={"date"} value={"2024-01-04"} />
						<smoothly-next-table-expandable-row>
							<smoothly-next-table-cell>
								<smoothly-display type={"date-time"} value={"2024-01-04T01:37:00.000Z"} />
							</smoothly-next-table-cell>
							<smoothly-next-table-cell>
								<smoothly-display type={"price"} currency={"EUR"} value={320} />
							</smoothly-next-table-cell>
							<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-04T01:37:00.000Z</Fragment>} />
						</smoothly-next-table-expandable-row>
						<smoothly-next-table-expandable-row>
							<smoothly-next-table-cell>
								<smoothly-display type={"date-time"} value={"2024-01-04T13:37:00.000Z"} />
							</smoothly-next-table-cell>
							<smoothly-next-table-cell>
								<smoothly-display type={"price"} currency={"EUR"} value={400} />
							</smoothly-next-table-cell>
							<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-04T13:37:00.000Z</Fragment>} />
						</smoothly-next-table-expandable-row>
					</smoothly-next-table-row-group>
					<smoothly-next-table-row-group>
						<smoothly-display slot={"end"} type={"price"} currency={"EUR"} value={720} />
						<smoothly-next-table-expandable-row>
							<smoothly-next-table-cell>
								<smoothly-display type={"date-time"} value={"2024-01-05T01:37:00.000Z"} />
							</smoothly-next-table-cell>
							<smoothly-next-table-cell>
								<smoothly-display type={"price"} currency={"EUR"} value={320} />
							</smoothly-next-table-cell>
							<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-05T01:37:00.000Z</Fragment>} />
						</smoothly-next-table-expandable-row>
						<smoothly-next-table-expandable-row>
							<smoothly-next-table-cell>
								<smoothly-display type={"date-time"} value={"2024-01-05T13:37:00.000Z"} />
							</smoothly-next-table-cell>
							<smoothly-next-table-cell>
								<smoothly-display type={"price"} currency={"EUR"} value={400} />
							</smoothly-next-table-cell>
							<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-05T13:37:00.000Z</Fragment>} />
						</smoothly-next-table-expandable-row>
					</smoothly-next-table-row-group>
					<fake-group-wrapper>
						<smoothly-next-table-row-group>
							<smoothly-display slot={"start"} type={"date"} value={"2024-01-06"} />
							<smoothly-display slot={"end"} type={"price"} currency={"EUR"} value={720} />
							<fake-row-wrapper>
								<smoothly-next-table-row>
									<fake-cell-wrapper>
										<smoothly-next-table-cell>
											<smoothly-display type={"date"} value={"2024-01-02"} />
										</smoothly-next-table-cell>
									</fake-cell-wrapper>
									<fake-expandable-cell-wrapper>
										<smoothly-next-table-expandable-cell>
											<smoothly-display type={"price"} currency={"EUR"} value={130} />
											<smoothly-lazy
												slot={"detail"}
												content={
													<span>
														<smoothly-display type={"price"} value={100} currency={"EUR"} />
														{" + "}
														<smoothly-display type={"price"} value={30} currency={"EUR"} />
													</span>
												}
											/>
										</smoothly-next-table-expandable-cell>
									</fake-expandable-cell-wrapper>
								</smoothly-next-table-row>
							</fake-row-wrapper>
							<fake-expandable-row-wrapper>
								<smoothly-next-table-expandable-row>
									<fake-cell-wrapper class="span-2">
										<smoothly-next-table-cell span={2}>
											<smoothly-display type={"date"} value={"2024-01-07"} />
										</smoothly-next-table-cell>
									</fake-cell-wrapper>
									<smoothly-lazy
										slot={"detail"}
										content={<smoothly-display type={"date-time"} value={"2024-01-07T13:37:00.000Z"} />}
									/>
								</smoothly-next-table-expandable-row>
							</fake-expandable-row-wrapper>
						</smoothly-next-table-row-group>
					</fake-group-wrapper>
					<smoothly-next-table-row-group>
						<smoothly-display slot={"start"} type={"date"} value={"2024-01-08"} />
						<smoothly-display slot={"end"} type={"price"} currency={"EUR"} value={720} />
					</smoothly-next-table-row-group>
				</smoothly-next-table>
			</Host>
		)
	}
}
