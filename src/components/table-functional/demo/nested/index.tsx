import { Component, h, Host, VNode } from "@stencil/core"
import { SmoothlyTableFunctionalCell } from "../../cell"
// import { RowFunctional } from "../../row"
import { data } from "./data"

@Component({
	tag: "smoothly-table-functional-demo-nested",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableFunctionalDemoNested {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-display type="text" value="Nested shadow DOM table" />
				<smoothly-table-functional color="primary" columns={8}>
					<smoothly-table-shadow-head>
						<smoothly-table-shadow-row>
							<SmoothlyTableFunctionalCell>Id</SmoothlyTableFunctionalCell>
							<SmoothlyTableFunctionalCell>Registered</SmoothlyTableFunctionalCell>
							<SmoothlyTableFunctionalCell>Name</SmoothlyTableFunctionalCell>
							<SmoothlyTableFunctionalCell>Age</SmoothlyTableFunctionalCell>
							<SmoothlyTableFunctionalCell>Balance</SmoothlyTableFunctionalCell>
							<SmoothlyTableFunctionalCell>EyeColor</SmoothlyTableFunctionalCell>
							<SmoothlyTableFunctionalCell>Gender</SmoothlyTableFunctionalCell>
							<SmoothlyTableFunctionalCell>Company</SmoothlyTableFunctionalCell>
						</smoothly-table-shadow-row>
					</smoothly-table-shadow-head>
					<smoothly-table-shadow-body>
						{Array.from({ length: Math.floor(200 / data.length) }).flatMap(() =>
							data.map(entry => (
								<smoothly-table-shadow-expandable-row>
									<smoothly-table-functional-demo-nested-inner color="secondary" data={entry.friends} slot={"detail"} />
									<SmoothlyTableFunctionalCell>{entry.id}</SmoothlyTableFunctionalCell>
									<SmoothlyTableFunctionalCell>{entry.registered}</SmoothlyTableFunctionalCell>
									<SmoothlyTableFunctionalCell>{entry.name}</SmoothlyTableFunctionalCell>
									<SmoothlyTableFunctionalCell>{entry.age}</SmoothlyTableFunctionalCell>
									<SmoothlyTableFunctionalCell>{entry.balance}</SmoothlyTableFunctionalCell>
									<SmoothlyTableFunctionalCell>{entry.eyeColor}</SmoothlyTableFunctionalCell>
									<SmoothlyTableFunctionalCell>{entry.gender}</SmoothlyTableFunctionalCell>
									<SmoothlyTableFunctionalCell>{entry.company}</SmoothlyTableFunctionalCell>
								</smoothly-table-shadow-expandable-row>
							))
						)}
					</smoothly-table-shadow-body>
					<smoothly-table-shadow-foot>
						<smoothly-table-shadow-row>
							<SmoothlyTableFunctionalCell>Footer Cell</SmoothlyTableFunctionalCell>
							<SmoothlyTableFunctionalCell>Footer Cell</SmoothlyTableFunctionalCell>
						</smoothly-table-shadow-row>
					</smoothly-table-shadow-foot>
				</smoothly-table-functional>
			</Host>
		)
	}
}
