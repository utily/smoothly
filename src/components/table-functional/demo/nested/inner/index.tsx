import { Component, h, Host, Prop, VNode } from "@stencil/core"
import { SmoothlyTableFunctionalCell } from "../../../cell"

@Component({
	tag: "smoothly-table-functional-demo-nested-inner",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableFunctionalDemoNestedInner {
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
							<SmoothlyTableFunctionalCell>Id</SmoothlyTableFunctionalCell>
							<SmoothlyTableFunctionalCell>Name</SmoothlyTableFunctionalCell>
							<SmoothlyTableFunctionalCell>Age</SmoothlyTableFunctionalCell>
							<SmoothlyTableFunctionalCell>Balance</SmoothlyTableFunctionalCell>
						</smoothly-table-shadow-row>
					</smoothly-table-shadow-head>
					<smoothly-table-shadow-body>
						{this.data?.map(entry => (
							<smoothly-table-shadow-expandable-row>
								<SmoothlyTableFunctionalCell>{entry.id}</SmoothlyTableFunctionalCell>
								<SmoothlyTableFunctionalCell>{entry.name}</SmoothlyTableFunctionalCell>
								<SmoothlyTableFunctionalCell>{entry.age}</SmoothlyTableFunctionalCell>
								<SmoothlyTableFunctionalCell>{entry.balance}</SmoothlyTableFunctionalCell>
							</smoothly-table-shadow-expandable-row>
						))}
					</smoothly-table-shadow-body>
				</smoothly-table>
			</Host>
		)
	}
}
