import { Component, h, Host, VNode } from "@stencil/core"
import { data } from "./data"

@Component({
	tag: "smoothly-table-shadow-demo-nested",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableShadowDemoNested {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-display type="text" value="Nested" />
				<smoothly-table color="primary" columns={8}>
					<smoothly-table-shadow-head>
						<smoothly-table-shadow-row>
							<smoothly-table-shadow-cell>Id</smoothly-table-shadow-cell>
							<smoothly-table-shadow-cell>Registered</smoothly-table-shadow-cell>
							<smoothly-table-shadow-cell>Name</smoothly-table-shadow-cell>
							<smoothly-table-shadow-cell>Age</smoothly-table-shadow-cell>
							<smoothly-table-shadow-cell>Balance</smoothly-table-shadow-cell>
							<smoothly-table-shadow-cell>EyeColor</smoothly-table-shadow-cell>
							<smoothly-table-shadow-cell>Gender</smoothly-table-shadow-cell>
							<smoothly-table-shadow-cell>Company</smoothly-table-shadow-cell>
						</smoothly-table-shadow-row>
					</smoothly-table-shadow-head>
					<smoothly-table-shadow-body>
						{Array.from({ length: Math.floor(2000 / data.length) }).flatMap(() => {
							data.map(entry => (
								<smoothly-table-shadow-expandable-row>
									<smoothly-table-shadow-demo-nested-inner color="secondary" data={entry.friends} slot={"detail"} />
									<smoothly-table-shadow-cell>{entry.id}</smoothly-table-shadow-cell>
									<smoothly-table-shadow-cell>{entry.registered}</smoothly-table-shadow-cell>
									<smoothly-table-shadow-cell>{entry.name}</smoothly-table-shadow-cell>
									<smoothly-table-shadow-cell>{entry.age}</smoothly-table-shadow-cell>
									<smoothly-table-shadow-cell>{entry.balance}</smoothly-table-shadow-cell>
									<smoothly-table-shadow-cell>{entry.eyeColor}</smoothly-table-shadow-cell>
									<smoothly-table-shadow-cell>{entry.gender}</smoothly-table-shadow-cell>
									<smoothly-table-shadow-cell>{entry.company}</smoothly-table-shadow-cell>
								</smoothly-table-shadow-expandable-row>
							))
						})}
					</smoothly-table-shadow-body>
					<smoothly-table-shadow-foot>
						<smoothly-table-shadow-row>
							<smoothly-table-shadow-cell>Footer Cell</smoothly-table-shadow-cell>
							<smoothly-table-shadow-cell>Footer Cell</smoothly-table-shadow-cell>
						</smoothly-table-shadow-row>
					</smoothly-table-shadow-foot>
				</smoothly-table>
			</Host>
		)
	}
}
