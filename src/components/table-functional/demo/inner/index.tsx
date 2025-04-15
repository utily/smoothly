import { Component, h, Host, Prop, VNode } from "@stencil/core"
import { SmoothlyTableFunctionalCell } from "../../cell/smoothlyTableCell"
import { SmoothlyTableFunctionalExpandableRow } from "../../expandable/row/smoothlyTableExpandableRow"
import { SmoothlyTableFunctionalRow } from "../../row/smoothlyTableRow"

@Component({
	tag: "smoothly-table-functional-demo-nested-inner",
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
				<smoothly-table-functional columns={4}>
					<SmoothlyTableFunctionalRow>
						<SmoothlyTableFunctionalCell>Id</SmoothlyTableFunctionalCell>
						<SmoothlyTableFunctionalCell>Name</SmoothlyTableFunctionalCell>
						<SmoothlyTableFunctionalCell>Age</SmoothlyTableFunctionalCell>
						<SmoothlyTableFunctionalCell>Balance</SmoothlyTableFunctionalCell>
					</SmoothlyTableFunctionalRow>
					{this.data?.map(entry => (
						<SmoothlyTableFunctionalExpandableRow>
							<SmoothlyTableFunctionalCell>{entry.id}</SmoothlyTableFunctionalCell>
							<SmoothlyTableFunctionalCell>{entry.name}</SmoothlyTableFunctionalCell>
							<SmoothlyTableFunctionalCell>{entry.age}</SmoothlyTableFunctionalCell>
							<SmoothlyTableFunctionalCell>{entry.balance}</SmoothlyTableFunctionalCell>
						</SmoothlyTableFunctionalExpandableRow>
					))}
				</smoothly-table-functional>
			</Host>
		)
	}
}
