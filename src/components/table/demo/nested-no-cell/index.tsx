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
				<smoothly-table color="primary" columns={9} stack-at="48rem">
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
							<div></div>
						</smoothly-table-row>
					</smoothly-table-head>
					<smoothly-table-body>
						{data.map(entry => (
							<smoothly-table-expandable-row>
								<smoothly-table-demo-nested-no-cell-inner color="secondary" data={entry.friends} slot={"detail"} />
								<smoothly-table-cell header="Id">{entry.id}</smoothly-table-cell>
								<smoothly-table-cell header="Registered">{entry.registered}</smoothly-table-cell>
								<smoothly-table-cell card-area="primary" header="Name">
									{entry.name}
								</smoothly-table-cell>
								<smoothly-table-cell header="Age">{entry.age}</smoothly-table-cell>
								<smoothly-table-cell header="Balance">{entry.balance}</smoothly-table-cell>
								<smoothly-table-cell card-area="status" header="EyeColor">
									{entry.eyeColor}
								</smoothly-table-cell>
								<smoothly-table-cell header="Gender">{entry.gender}</smoothly-table-cell>
								<smoothly-table-cell header="Company">{entry.company}</smoothly-table-cell>
								<smoothly-table-cell card-area="actions">
									<smoothly-icon
										name="trash-bin-outline"
										color="danger"
										fill="outline"
										onClick={() => console.log("Delete", entry.name)}
									/>
								</smoothly-table-cell>
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
