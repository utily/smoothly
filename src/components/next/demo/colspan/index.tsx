import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-demo-colspan",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextDemoColspan {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-next-table columns={3}>
					<smoothly-next-table-head>
						<smoothly-next-table-row>
							<smoothly-next-table-cell>Date</smoothly-next-table-cell>
							<smoothly-next-table-cell>Skip</smoothly-next-table-cell>
							<smoothly-next-table-cell>Total</smoothly-next-table-cell>
						</smoothly-next-table-row>
					</smoothly-next-table-head>
					<smoothly-next-table-body>
						<smoothly-next-table-row>
							<smoothly-next-table-cell span={2}>
								<smoothly-display type={"date"} value={"2024-01-01"} />
							</smoothly-next-table-cell>
							<smoothly-next-table-cell>
								<smoothly-display type={"price"} value={120} currency={"EUR"} />
							</smoothly-next-table-cell>
						</smoothly-next-table-row>
						<smoothly-next-table-row>
							<smoothly-next-table-expandable-cell span={2}>
								<smoothly-display type={"date"} value={"2024-01-02"} />
								<smoothly-lazy
									slot={"detail"}
									content={<smoothly-display type={"date-time"} value={"2024-01-02T13:37:00.000Z"} />}
								/>
							</smoothly-next-table-expandable-cell>
							<smoothly-next-table-expandable-cell>
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
							</smoothly-next-table-expandable-cell>
						</smoothly-next-table-row>
					</smoothly-next-table-body>
				</smoothly-next-table>
			</Host>
		)
	}
}
