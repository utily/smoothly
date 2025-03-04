import { Component, Fragment, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-demo-group",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableDemoGroup {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-display type="text" value="Group" />
				<smoothly-table color="primary" columns={2}>
					<smoothly-table-head>
						<smoothly-table-row>
							<smoothly-table-cell>Date</smoothly-table-cell>
							<smoothly-table-cell>Total</smoothly-table-cell>
						</smoothly-table-row>
					</smoothly-table-head>
					<smoothly-table-body>
						<smoothly-table-row-group align>
							<smoothly-display slot={"start"} type="date" value={"2024-01-01"} />
							<smoothly-display slot={"end"} type={"price"} currency={"EUR"} value={510} />
							<smoothly-table-expandable-row>
								<smoothly-table-cell>
									<smoothly-display type={"date-time"} value={"2024-01-01T01:37:00.000Z"} />
								</smoothly-table-cell>
								<smoothly-table-cell>
									<smoothly-display type={"price"} currency={"EUR"} value={250} />
								</smoothly-table-cell>
								<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-01T01:37:00.000Z</Fragment>} />
							</smoothly-table-expandable-row>
							<smoothly-table-expandable-row>
								<smoothly-table-cell>
									<smoothly-display type={"date-time"} value={"2024-01-01T13:37:00.000Z"} />
								</smoothly-table-cell>
								<smoothly-table-cell>
									<smoothly-display type={"price"} currency={"EUR"} value={260} />
								</smoothly-table-cell>
								<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-01T13:37:00.000Z</Fragment>} />
							</smoothly-table-expandable-row>
						</smoothly-table-row-group>
						<smoothly-table-row>
							<smoothly-table-cell>
								<smoothly-display type={"date"} value={"2024-01-02"} />
							</smoothly-table-cell>
							<smoothly-table-cell>
								<smoothly-display type={"price"} currency={"EUR"} value={130} />
							</smoothly-table-cell>
						</smoothly-table-row>
						<smoothly-table-row-group>
							<smoothly-display slot={"start"} type={"date"} value={"2024-01-03"} />
							<smoothly-display slot={"end"} type={"price"} currency={"EUR"} value={720} />
							<smoothly-table-expandable-row>
								<smoothly-table-cell>
									<smoothly-display type={"date-time"} value={"2024-01-03T01:37:00.000Z"} />
								</smoothly-table-cell>
								<smoothly-table-cell>
									<smoothly-display type={"price"} currency={"EUR"} value={320} />
								</smoothly-table-cell>
								<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-03T01:37:00.000Z</Fragment>} />
							</smoothly-table-expandable-row>
							<smoothly-table-expandable-row>
								<smoothly-table-cell>
									<smoothly-display type={"date-time"} value={"2024-01-03T13:37:00.000Z"} />
								</smoothly-table-cell>
								<smoothly-table-cell>
									<smoothly-display type={"price"} currency={"EUR"} value={400} />
								</smoothly-table-cell>
								<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-03T13:37:00.000Z</Fragment>} />
							</smoothly-table-expandable-row>
						</smoothly-table-row-group>
						<smoothly-table-row-group>
							<smoothly-display slot={"start"} type={"date"} value={"2024-01-04"} />
							<smoothly-table-expandable-row>
								<smoothly-table-cell>
									<smoothly-display type={"date-time"} value={"2024-01-04T01:37:00.000Z"} />
								</smoothly-table-cell>
								<smoothly-table-cell>
									<smoothly-display type={"price"} currency={"EUR"} value={320} />
								</smoothly-table-cell>
								<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-04T01:37:00.000Z</Fragment>} />
							</smoothly-table-expandable-row>
							<smoothly-table-expandable-row>
								<smoothly-table-cell>
									<smoothly-display type={"date-time"} value={"2024-01-04T13:37:00.000Z"} />
								</smoothly-table-cell>
								<smoothly-table-cell>
									<smoothly-display type={"price"} currency={"EUR"} value={400} />
								</smoothly-table-cell>
								<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-04T13:37:00.000Z</Fragment>} />
							</smoothly-table-expandable-row>
						</smoothly-table-row-group>
						<smoothly-table-row-group>
							<smoothly-display slot={"end"} type={"price"} currency={"EUR"} value={720} />
							<smoothly-table-expandable-row>
								<smoothly-table-cell>
									<smoothly-display type={"date-time"} value={"2024-01-05T01:37:00.000Z"} />
								</smoothly-table-cell>
								<smoothly-table-cell>
									<smoothly-display type={"price"} currency={"EUR"} value={320} />
								</smoothly-table-cell>
								<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-05T01:37:00.000Z</Fragment>} />
							</smoothly-table-expandable-row>
							<smoothly-table-expandable-row>
								<smoothly-table-cell>
									<smoothly-display type={"date-time"} value={"2024-01-05T13:37:00.000Z"} />
								</smoothly-table-cell>
								<smoothly-table-cell>
									<smoothly-display type={"price"} currency={"EUR"} value={400} />
								</smoothly-table-cell>
								<smoothly-lazy slot={"detail"} content={<Fragment>Details of 2024-01-05T13:37:00.000Z</Fragment>} />
							</smoothly-table-expandable-row>
						</smoothly-table-row-group>
						<fake-group-wrapper>
							<smoothly-table-row-group>
								<smoothly-display slot={"start"} type={"date"} value={"2024-01-06"} />
								<smoothly-display slot={"end"} type={"price"} currency={"EUR"} value={720} />
								<fake-row-wrapper>
									<smoothly-table-row>
										<fake-cell-wrapper>
											<smoothly-table-cell>
												<smoothly-display type={"date"} value={"2024-01-02"} />
											</smoothly-table-cell>
										</fake-cell-wrapper>
										<fake-expandable-cell-wrapper>
											<smoothly-table-expandable-cell>
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
											</smoothly-table-expandable-cell>
										</fake-expandable-cell-wrapper>
									</smoothly-table-row>
								</fake-row-wrapper>
								<fake-expandable-row-wrapper>
									<smoothly-table-expandable-row>
										<fake-cell-wrapper class="span-2">
											<smoothly-table-cell span={2}>
												<smoothly-display type={"date"} value={"2024-01-07"} />
											</smoothly-table-cell>
										</fake-cell-wrapper>
										<smoothly-lazy
											slot={"detail"}
											content={<smoothly-display type={"date-time"} value={"2024-01-07T13:37:00.000Z"} />}
										/>
									</smoothly-table-expandable-row>
								</fake-expandable-row-wrapper>
							</smoothly-table-row-group>
						</fake-group-wrapper>
						<smoothly-table-row-group>
							<smoothly-display slot={"start"} type={"date"} value={"2024-01-08"} />
							<smoothly-display slot={"end"} type={"price"} currency={"EUR"} value={720} />
						</smoothly-table-row-group>
					</smoothly-table-body>
				</smoothly-table>
			</Host>
		)
	}
}
