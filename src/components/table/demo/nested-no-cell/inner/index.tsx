import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-demo-nested-no-cell-inner",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableDemoNestedNoCellInner {
	@Prop() data?: {
		id: number
		name: string
		age: number
		balance: number
	}[]
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-table columns={4}>
					<smoothly-table-head>
						<smoothly-table-row>
							<div class="smoothly-table-cell">Id</div>
							<div class="smoothly-table-cell">Name</div>
							<div class="smoothly-table-cell">Age</div>
							<div class="smoothly-table-cell">Balance</div>
						</smoothly-table-row>
					</smoothly-table-head>
					<smoothly-table-body>
						{this.data?.map(entry => (
							<smoothly-table-expandable-row>
								<div class="smoothly-table-cell">{entry.id}</div>
								<div class="smoothly-table-cell">{entry.name}</div>
								<div class="smoothly-table-cell">{entry.age}</div>
								<div class="smoothly-table-cell">{entry.balance}</div>
								<div slot={"detail"}>
									<smoothly-table columns={4}>
										<smoothly-table-head>
											<smoothly-table-row>
												<div class="smoothly-table-cell">Id 2</div>
												<div class="smoothly-table-cell">Name 2</div>
												<div class="smoothly-table-cell">Age 2</div>
												<div class="smoothly-table-cell">Balance 2</div>
											</smoothly-table-row>
										</smoothly-table-head>
										<smoothly-table-body>
											{this.data?.map(entry => (
												<smoothly-table-expandable-row>
													<div class="smoothly-table-cell">{entry.id}</div>
													<div class="smoothly-table-cell">{entry.name}</div>
													<div class="smoothly-table-cell">{entry.age}</div>
													<div class="smoothly-table-cell">{entry.balance}</div>
													<div slot={"detail"}>Content of the expandable cell</div>
												</smoothly-table-expandable-row>
											))}
										</smoothly-table-body>
									</smoothly-table>
								</div>
							</smoothly-table-expandable-row>
						))}
					</smoothly-table-body>
				</smoothly-table>
			</Host>
		)
	}
}
