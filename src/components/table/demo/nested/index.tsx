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
				<table>
					<thead>
						<tr>
							<table-cell value="Id" />
							<table-cell value="Registered" />
							<table-cell value="Name" />
							<table-cell value="Age" />
							<table-cell value="Balance" />
							<table-cell value="EyeColor" />
							<table-cell value="Gender" />
							<table-cell value="Company" />
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: Math.floor(5000 / data.length) }).flatMap(() =>
							data.map(entry => (
								<tr>
									<table-cell value={entry.id} />
									<table-cell value={entry.registered} />
									<table-cell value={entry.name} />
									<table-cell value={String(entry.age)} />
									<table-cell value={String(entry.balance)} />
									<table-cell value={entry.eyeColor} />
									<table-cell value={entry.gender} />
									<table-cell value={entry.company} />
								</tr>
							))
						)}
					</tbody>
					<trow>
						<tr>
							<table-cell value="Footer Cell" />
							<table-cell value="Footer Cell" />
						</tr>
					</trow>
				</table>
				<smoothly-display type="text" value="Nested" />
			</Host>
		)
	}
}
