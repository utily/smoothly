import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-demo-nested-inner",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextDemoNestedInner {
	@Prop() data?: {
		id: number
		name: string
		age: number
		balance: number
	}[]
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-next-table columns={4}>
					<smoothly-next-table-head>
						<smoothly-next-table-row>
							<smoothly-next-table-cell>Id</smoothly-next-table-cell>
							<smoothly-next-table-cell>Name</smoothly-next-table-cell>
							<smoothly-next-table-cell>Age</smoothly-next-table-cell>
							<smoothly-next-table-cell>Balance</smoothly-next-table-cell>
						</smoothly-next-table-row>
					</smoothly-next-table-head>
					<smoothly-next-table-body>
						{this.data?.map(entry => (
							<smoothly-next-table-row>
								<smoothly-next-table-cell>{entry.id}</smoothly-next-table-cell>
								<smoothly-next-table-cell>{entry.name}</smoothly-next-table-cell>
								<smoothly-next-table-cell>{entry.age}</smoothly-next-table-cell>
								<smoothly-next-table-cell>{entry.balance}</smoothly-next-table-cell>
							</smoothly-next-table-row>
						))}
					</smoothly-next-table-body>
				</smoothly-next-table>
			</Host>
		)
	}
}
