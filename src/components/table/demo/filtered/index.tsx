import { Component, ComponentWillLoad, h, Listen, State } from "@stencil/core"
import * as selectively from "selectively"
import { Criteria } from "selectively"
import * as http from "cloudly-http"
import { Root } from "./Root"

@Component({
	tag: "smoothly-table-demo-filtered",
	styleUrl: "style.css",
	scoped: true,
})
export class TableDemoFiltered implements ComponentWillLoad {
	@State() criteria: Criteria
	@State() data?: Root | false

	@Listen("filters")
	onFilterUpdate(event: CustomEvent<Record<string, Criteria>>) {
		event.stopPropagation()
		this.criteria = event.detail
		console.log(event.detail)
	}
	inputElement: HTMLSmoothlyInputElement

	async componentWillLoad(): Promise<void> {
		const response = await http.fetch("https://archive.org/metadata/principleofrelat00eins")
		this.data = response.status == 200 && (await response.body)
	}

	render() {
		const data = this.data
		return !data
			? "Failed to load data."
			: [
					<smoothly-filter>
						<smoothly-filter-input criteria={this.criteria} name="name"></smoothly-filter-input>
						<smoothly-filter-input criteria={this.criteria} name="source"></smoothly-filter-input>
					</smoothly-filter>,

					<smoothly-table>
						<smoothly-table-row>
							<smoothly-table-header>name</smoothly-table-header>
							<smoothly-table-header>source</smoothly-table-header>
						</smoothly-table-row>
						{selectively.filter(this.criteria, data.files).map(file => (
							<smoothly-table-row>
								<smoothly-table-expandable-cell>
									{file.name}
									<div slot="detail"> expandable cell 1 content</div>
								</smoothly-table-expandable-cell>
								<smoothly-table-expandable-cell>
									{file.source}
									<div slot="detail"> expandable cell 2 content</div>
								</smoothly-table-expandable-cell>
							</smoothly-table-row>
						))}
					</smoothly-table>,
			  ]
	}
}
