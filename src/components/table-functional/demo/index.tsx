import { Component, h, Host, VNode } from "@stencil/core"
import { SmoothlyTableFunctionalCell } from "../cell/smoothlyTableCell"
import { SmoothlyTableFunctionalExpandableRow } from "../expandable/row/smoothlyTableExpandableRow"
import { SmoothlyTableFunctionalRow } from "../row/smoothlyTableRow"
import { data } from "./data"

@Component({
	tag: "smoothly-table-functional-demo",
	scoped: true,
})
export class SmoothlyTableFunctionalDemo {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-table-functional columns={9}>
					<SmoothlyTableFunctionalRow>
						<SmoothlyTableFunctionalCell>Id</SmoothlyTableFunctionalCell>
						<SmoothlyTableFunctionalCell>Registered</SmoothlyTableFunctionalCell>
						<SmoothlyTableFunctionalCell>Name</SmoothlyTableFunctionalCell>
						<SmoothlyTableFunctionalCell>Age</SmoothlyTableFunctionalCell>
						<SmoothlyTableFunctionalCell>Balance</SmoothlyTableFunctionalCell>
						<SmoothlyTableFunctionalCell>Eye color</SmoothlyTableFunctionalCell>
						<SmoothlyTableFunctionalCell>Gender</SmoothlyTableFunctionalCell>
						<SmoothlyTableFunctionalCell>Company</SmoothlyTableFunctionalCell>
					</SmoothlyTableFunctionalRow>
					{Array.from({ length: Math.floor(20 / data.length) }).flatMap(() =>
						data.map(entry => (
							<SmoothlyTableFunctionalExpandableRow>
								<SmoothlyTableFunctionalCell>{entry.id}</SmoothlyTableFunctionalCell>
								<SmoothlyTableFunctionalCell>{entry.registered}</SmoothlyTableFunctionalCell>
								<SmoothlyTableFunctionalCell>{entry.name}</SmoothlyTableFunctionalCell>
								<SmoothlyTableFunctionalCell>{entry.age}</SmoothlyTableFunctionalCell>
								<SmoothlyTableFunctionalCell>{entry.balance}</SmoothlyTableFunctionalCell>
								<SmoothlyTableFunctionalCell>{entry.eyeColor}</SmoothlyTableFunctionalCell>
								<SmoothlyTableFunctionalCell>{entry.gender}</SmoothlyTableFunctionalCell>
								<SmoothlyTableFunctionalCell>{entry.company}</SmoothlyTableFunctionalCell>
								<smoothly-table-functional-demo-nested-inner data={entry.friends} />
							</SmoothlyTableFunctionalExpandableRow>
						))
					)}
					<SmoothlyTableFunctionalRow>
						<SmoothlyTableFunctionalCell>
							<span>Id</span>
						</SmoothlyTableFunctionalCell>
						<SmoothlyTableFunctionalCell>
							<span>This is an id</span>
						</SmoothlyTableFunctionalCell>
					</SmoothlyTableFunctionalRow>
				</smoothly-table-functional>
			</Host>
		)
	}
}
