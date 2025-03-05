import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-demo-nested-inner",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableDemoNestedInner {
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
							<smoothly-table-cell>Id</smoothly-table-cell>
							<smoothly-table-cell>Name</smoothly-table-cell>
							<smoothly-table-cell>Age</smoothly-table-cell>
							<smoothly-table-cell>Balance</smoothly-table-cell>
						</smoothly-table-row>
					</smoothly-table-head>
					<smoothly-table-body>
						{this.data?.map(entry => (
							<smoothly-table-expandable-row>
								<smoothly-table-cell>{entry.id}</smoothly-table-cell>
								<smoothly-table-cell>{entry.name}</smoothly-table-cell>
								<smoothly-table-cell>{entry.age}</smoothly-table-cell>
								<smoothly-table-cell>{entry.balance}</smoothly-table-cell>
							</smoothly-table-expandable-row>
						))}
					</smoothly-table-body>
				</smoothly-table>
			</Host>
		)
	}
}
