import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-demo-colspan",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableDemoColspan {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-table columns={3}>
					<smoothly-table-head>
						<smoothly-table-row>
							<smoothly-table-cell>Date</smoothly-table-cell>
							<smoothly-table-cell>Skip</smoothly-table-cell>
							<smoothly-table-cell>Total</smoothly-table-cell>
						</smoothly-table-row>
					</smoothly-table-head>
					<smoothly-table-body>
						<smoothly-table-row>
							<smoothly-table-cell span={2}>
								<smoothly-display type={"date"} value={"2024-01-01"} />
							</smoothly-table-cell>
							<smoothly-table-cell>
								<smoothly-display type={"price"} value={120} currency={"EUR"} />
							</smoothly-table-cell>
						</smoothly-table-row>
						<smoothly-table-row>
							<smoothly-table-expandable-cell span={2}>
								<smoothly-display type={"date"} value={"2024-01-02"} />
								<smoothly-lazy
									slot={"detail"}
									content={<smoothly-display type={"date-time"} value={"2024-01-02T13:37:00.000Z"} />}
								/>
							</smoothly-table-expandable-cell>
							<smoothly-table-expandable-cell>
								<smoothly-display type={"price"} value={220} currency={"EUR"} />
								<smoothly-lazy
									slot={"detail"}
									content={
										<span>
											<smoothly-display type={"price"} value={120} currency={"EUR"} />
											{" + "}
											<smoothly-display type={"price"} value={100} currency={"EUR"} />
										</span>
									}
								/>
							</smoothly-table-expandable-cell>
						</smoothly-table-row>
						<smoothly-table-row>
							<smoothly-table-cell>
								<smoothly-display type={"date"} value={"2024-01-02"} />
							</smoothly-table-cell>
							<smoothly-table-cell>Not Skipped</smoothly-table-cell>
							<smoothly-table-cell>
								<smoothly-display type={"price"} value={320} currency={"EUR"} />
							</smoothly-table-cell>
						</smoothly-table-row>
					</smoothly-table-body>
				</smoothly-table>
			</Host>
		)
	}
}
