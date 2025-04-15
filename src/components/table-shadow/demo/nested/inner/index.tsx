import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-shadow-demo-nested-inner",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyTableShadowDemoNestedInner {
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
					<smoothly-table-shadow-head>
						<smoothly-table-shadow-row>
							<smoothly-table-shadow-cell>Id</smoothly-table-shadow-cell>
							<smoothly-table-shadow-cell>Name</smoothly-table-shadow-cell>
							<smoothly-table-shadow-cell>Age</smoothly-table-shadow-cell>
							<smoothly-table-shadow-cell>Balance</smoothly-table-shadow-cell>
						</smoothly-table-shadow-row>
					</smoothly-table-shadow-head>
					<smoothly-table-shadow-body>
						{this.data?.map(entry => (
							<smoothly-table-shadow-expandable-row>
								<smoothly-table-shadow-cell>{entry.id}</smoothly-table-shadow-cell>
								<smoothly-table-shadow-cell>{entry.name}</smoothly-table-shadow-cell>
								<smoothly-table-shadow-cell>{entry.age}</smoothly-table-shadow-cell>
								<smoothly-table-shadow-cell>{entry.balance}</smoothly-table-shadow-cell>
							</smoothly-table-shadow-expandable-row>
						))}
					</smoothly-table-shadow-body>
				</smoothly-table>
			</Host>
		)
	}
}
