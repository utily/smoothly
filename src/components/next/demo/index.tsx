import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextDemo {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-next-table columns={2}>
					<smoothly-next-table-head>
						<smoothly-next-table-row>
							<smoothly-next-table-cell>Id</smoothly-next-table-cell>
							<smoothly-next-table-cell>Name</smoothly-next-table-cell>
						</smoothly-next-table-row>
					</smoothly-next-table-head>
					<smoothly-next-table-body>
						<smoothly-next-table-row>
							<smoothly-next-table-cell>foo</smoothly-next-table-cell>
							<smoothly-next-table-cell>Foo</smoothly-next-table-cell>
						</smoothly-next-table-row>
						<smoothly-next-table-expandable-row>
							<div slot={"detail"}>The Detail of Bar!</div>
							<smoothly-next-table-cell>bar</smoothly-next-table-cell>
							<smoothly-next-table-cell>Bar</smoothly-next-table-cell>
						</smoothly-next-table-expandable-row>
					</smoothly-next-table-body>
				</smoothly-next-table>
			</Host>
		)
	}
}
