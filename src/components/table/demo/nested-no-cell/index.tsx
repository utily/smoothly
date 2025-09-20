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
							<div class="smoothly-table-cell">Id</div>
							<div class="smoothly-table-cell">Registered</div>
							<div class="smoothly-table-cell">Name</div>
							<div class="smoothly-table-cell">Age</div>
							<div class="smoothly-table-cell">Balance</div>
							<div class="smoothly-table-cell">EyeColor</div>
							<div class="smoothly-table-cell">Gender</div>
							<div class="smoothly-table-cell">Company</div>
						</smoothly-table-row>
					</smoothly-table-head>
					<smoothly-table-body>
						{data.map(entry => (
							<smoothly-table-expandable-row>
								<smoothly-table-demo-nested-no-cell-inner color="secondary" data={entry.friends} slot={"detail"} />
								<div class="smoothly-table-cell">{entry.id}</div>
								<div class="smoothly-table-cell">{entry.registered}</div>
								<div class="smoothly-table-cell">{entry.name}</div>
								<div class="smoothly-table-cell">{entry.age}</div>
								<div class="smoothly-table-cell">{entry.balance}</div>
								<div class="smoothly-table-cell">{entry.eyeColor}</div>
								<div class="smoothly-table-cell">{entry.gender}</div>
								<div class="smoothly-table-cell">{entry.company}</div>
							</smoothly-table-expandable-row>
						))}
					</smoothly-table-body>
					<smoothly-table-foot>
						<smoothly-table-row>
							<div class="smoothly-table-cell">Footer Cell</div>
							<div class="smoothly-table-cell">Footer Cell</div>
						</smoothly-table-row>
					</smoothly-table-foot>
				</smoothly-table>
			</Host>
		)
	}
}
