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
							<p>Id</p>
							<p>Name</p>
							<p>Age</p>
							<p>Balance</p>
						</smoothly-table-row>
					</smoothly-table-head>
					<smoothly-table-body>
						{this.data?.map(entry => (
							<smoothly-table-expandable-row>
								<p>{entry.id}</p>
								<p>{entry.name}</p>
								<p>{entry.age}</p>
								<p>{entry.balance}</p>
							</smoothly-table-expandable-row>
						))}
					</smoothly-table-body>
				</smoothly-table>
			</Host>
		)
	}
}
