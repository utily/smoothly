import { Component, h, Host, VNode } from "@stencil/core"
import { data } from "./data"

@Component({
	tag: "smoothly-table-demo-nested",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableDemoNested {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-display type="text" value="Nested" />
				<smoothly-table color="primary" columns={8}>
					<smoothly-table-head>
						<smoothly-table-row>
							<smoothly-table-cell>Id</smoothly-table-cell>
							<smoothly-table-cell>Registered</smoothly-table-cell>
							<smoothly-table-cell>Name</smoothly-table-cell>
							<smoothly-table-cell>Age</smoothly-table-cell>
							<smoothly-table-cell>Balance</smoothly-table-cell>
							<smoothly-table-cell>EyeColor</smoothly-table-cell>
							<smoothly-table-cell>Gender</smoothly-table-cell>
							<smoothly-table-cell>Company</smoothly-table-cell>
						</smoothly-table-row>
					</smoothly-table-head>
					<smoothly-table-body>
						{Array.from({ length: 20 }).flatMap(() =>
							data.map(entry => (
								<smoothly-table-row>
									{/* <smoothly-table-demo-nested-inner color="secondary" data={entry.friends} slot={"detail"} /> */}
									<smoothly-table-cell>{entry.id}</smoothly-table-cell>
									<smoothly-table-cell>{entry.registered}</smoothly-table-cell>
									<smoothly-table-cell>{entry.name}</smoothly-table-cell>
									<smoothly-table-cell>{entry.age}</smoothly-table-cell>
									<smoothly-table-cell>{entry.balance}</smoothly-table-cell>
									<smoothly-table-cell>{entry.eyeColor}</smoothly-table-cell>
									<smoothly-table-cell>{entry.gender}</smoothly-table-cell>
									<smoothly-table-cell>{entry.company}</smoothly-table-cell>
								</smoothly-table-row>
							))
						)}
					</smoothly-table-body>
					<smoothly-table-foot>
						<smoothly-table-row>
							<smoothly-table-cell>Footer Cell</smoothly-table-cell>
							<smoothly-table-cell>Footer Cell</smoothly-table-cell>
						</smoothly-table-row>
					</smoothly-table-foot>
				</smoothly-table>
			</Host>
		)
	}
}
