import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-table-demo-checked",
	styleUrl: "style.css",
	scoped: true,
})
export class TableDemoChecked {
	render() {
		return [
			<div>sketch</div>,
			<br />,
			<smoothly-table>
				<smoothly-table-row>
					<smoothly-table-header>
						<smoothly-checkbox />
					</smoothly-table-header>
					<smoothly-table-header>header</smoothly-table-header>
				</smoothly-table-row>
				<smoothly-table-row>
					<smoothly-table-cell>
						<smoothly-checkbox />
					</smoothly-table-cell>
					<smoothly-table-cell>content</smoothly-table-cell>
				</smoothly-table-row>
			</smoothly-table>,
		]
	}
}
