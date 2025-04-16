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
							<div>Id</div>
							<div>Name</div>
							<div>Age</div>
							<div>Balance</div>
						</smoothly-table-row>
					</smoothly-table-head>
					<smoothly-table-body>
						{this.data?.map(entry => (
							<smoothly-table-expandable-row>
								<div>{entry.id}</div>
								<div>{entry.name}</div>
								<div>{entry.age}</div>
								<div>{entry.balance}</div>
							</smoothly-table-expandable-row>
						))}
					</smoothly-table-body>
				</smoothly-table>
			</Host>
		)
	}
}
