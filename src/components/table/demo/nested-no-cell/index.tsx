import { Component, h, Host, VNode } from "@stencil/core"
import { data } from "./data"

@Component({
	tag: "smoothly-table-demo-nested-no-cell",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableDemoNestedNoCell {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-display type="text" value="Nested" />
				<smoothly-table color="primary" columns={8}>
					<smoothly-table-head>
						<smoothly-table-row>
							<div>Id</div>
							<div>Registered</div>
							<div>Name</div>
							<div>Age</div>
							<div>Balance</div>
							<div>EyeColor</div>
							<div>Gender</div>
							<div>Company</div>
						</smoothly-table-row>
					</smoothly-table-head>
					<smoothly-table-body>
						{data.map(entry => (
							<smoothly-table-expandable-row>
								<smoothly-table-demo-nested-no-cell-inner color="secondary" data={entry.friends} slot={"detail"} />
								<div>{entry.id}</div>
								<div>{entry.registered}</div>
								<div>{entry.name}</div>
								<div>{entry.age}</div>
								<div>{entry.balance}</div>
								<div>{entry.eyeColor}</div>
								<div>{entry.gender}</div>
								<div>{entry.company}</div>
							</smoothly-table-expandable-row>
						))}
					</smoothly-table-body>
					<smoothly-table-foot>
						<smoothly-table-row>
							<div>Footer Cell</div>
							<div>Footer Cell</div>
						</smoothly-table-row>
					</smoothly-table-foot>
				</smoothly-table>
			</Host>
		)
	}
}
