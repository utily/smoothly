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
							<p>Id</p>
							<p>Registered</p>
							<p>Name</p>
							<p>Age</p>
							<p>Balance</p>
							<p>EyeColor</p>
							<p>Gender</p>
							<p>Company</p>
						</smoothly-table-row>
					</smoothly-table-head>
					<smoothly-table-body>
						{Array.from({ length: Math.floor(200 / data.length) }).flatMap(() =>
							data.map(entry => (
								<smoothly-table-shadow-expandable-row>
									<smoothly-table-demo-nested-inner color="secondary" data={entry.friends} slot={"detail"} />
									<p>{entry.id}</p>
									<p>{entry.registered}</p>
									<p>{entry.name}</p>
									<p>{entry.age}</p>
									<p>{entry.balance}</p>
									<p>{entry.eyeColor}</p>
									<p>{entry.gender}</p>
									<p>{entry.company}</p>
								</smoothly-table-shadow-expandable-row>
							))
						)}
					</smoothly-table-body>
					<smoothly-table-foot>
						<smoothly-table-row>Footer Cell Footer Cell</smoothly-table-row>
					</smoothly-table-foot>
				</smoothly-table>
			</Host>
		)
	}
}
