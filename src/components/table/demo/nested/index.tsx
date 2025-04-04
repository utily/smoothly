import { Component, h, Host, VNode } from "@stencil/core"
// import { data } from "./data"

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
				{/* <table>
					<thead>
						<tr>
							<td>Id</td>
							<td>Registered</td>
							<td>Name</td>
							<td>Age</td>
							<td>Balance</td>
							<td>EyeColor</td>
							<td>Gender</td>
							<td>Company</td>
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: Math.floor(2000 / data.length) }).flatMap(() =>
							data.map(entry => (
								<tr>
									<td>{entry.id}</td>
									<td>{entry.registered}</td>
									<td>{entry.name}</td>
									<td>{entry.age}</td>
									<td>{entry.balance}</td>
									<td>{entry.eyeColor}</td>
									<td>{entry.gender}</td>
									<td>{entry.company}</td>
								</tr>
							))
						)}
					</tbody>
					<trow>
						<tr>
							<td>Footer Cell</td>
							<td>Footer Cell</td>
						</tr>
					</trow>
				</table> */}
				<smoothly-display type="text" value="Nested" />
			</Host>
		)
	}
}
