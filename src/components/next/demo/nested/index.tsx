import { Component, h, Host, VNode } from "@stencil/core"
import { data } from "./data"

@Component({
	tag: "smoothly-next-demo-nested",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextDemoNested {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-display type="text" value="Nested" />
				<smoothly-next-table color="primary" columns={8}>
					<smoothly-next-table-head>
						<smoothly-next-table-row>
							<smoothly-next-table-cell>Id</smoothly-next-table-cell>
							<smoothly-next-table-cell>Registered</smoothly-next-table-cell>
							<smoothly-next-table-cell>Name</smoothly-next-table-cell>
							<smoothly-next-table-cell>Age</smoothly-next-table-cell>
							<smoothly-next-table-cell>Balance</smoothly-next-table-cell>
							<smoothly-next-table-cell>EyeColor</smoothly-next-table-cell>
							<smoothly-next-table-cell>Gender</smoothly-next-table-cell>
							<smoothly-next-table-cell>Company</smoothly-next-table-cell>
						</smoothly-next-table-row>
					</smoothly-next-table-head>
					<smoothly-next-table-body>
						{data.map(entry => (
							<smoothly-next-table-expandable-row>
								<smoothly-next-demo-nested-inner color="secondary" data={entry.friends} slot={"detail"} />
								<smoothly-next-table-cell>{entry.id}</smoothly-next-table-cell>
								<smoothly-next-table-cell>{entry.registered}</smoothly-next-table-cell>
								<smoothly-next-table-cell>{entry.name}</smoothly-next-table-cell>
								<smoothly-next-table-cell>{entry.age}</smoothly-next-table-cell>
								<smoothly-next-table-cell>{entry.balance}</smoothly-next-table-cell>
								<smoothly-next-table-cell>{entry.eyeColor}</smoothly-next-table-cell>
								<smoothly-next-table-cell>{entry.gender}</smoothly-next-table-cell>
								<smoothly-next-table-cell>{entry.company}</smoothly-next-table-cell>
							</smoothly-next-table-expandable-row>
						))}
					</smoothly-next-table-body>
					<smoothly-next-table-foot>
						<smoothly-next-table-row>
							<smoothly-next-table-cell>Footer Cell</smoothly-next-table-cell>
							<smoothly-next-table-cell>Footer Cell</smoothly-next-table-cell>
						</smoothly-next-table-row>
					</smoothly-next-table-foot>
				</smoothly-next-table>
			</Host>
		)
	}
}
