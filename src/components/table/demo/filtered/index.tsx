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
		console.log("event.detail :", event.detail)
	}

	async componentWillLoad(): Promise<void> {
		const response = await http.fetch("https://catfact.ninja/breeds?limit=10")
		this.data = response.status == 200 && (await response.body)
	}

	render() {
		const data = this.data
		return !data
			? "Failed to load data."
			: [
					<smoothly-filter>
						<smoothly-filter-input name="breed">
							<smoothly-icon slot="start" name="search-outline" size="tiny" />
							breed
						</smoothly-filter-input>
						<smoothly-filter-input name="country">
							<smoothly-icon slot="start" name="search-outline" size="tiny" />
							country
						</smoothly-filter-input>
						<smoothly-filter-input name="coat">
							<smoothly-icon slot="start" name="search-outline" size="tiny" />
							coat
						</smoothly-filter-input>
						<smoothly-filter-input name="pattern">
							<smoothly-icon slot="start" name="search-outline" size="tiny" />
							pattern
						</smoothly-filter-input>
					</smoothly-filter>,

					<smoothly-table>
						<smoothly-table-row>
							<smoothly-table-header>breed</smoothly-table-header>
							<smoothly-table-header>coat</smoothly-table-header>
						</smoothly-table-row>
						{selectively.filter(this.criteria, data.data).map(cat => (
							<smoothly-table-row>
								<smoothly-table-expandable-cell>
									{cat.breed}
									<div slot="detail">Country: {cat.country}</div>
								</smoothly-table-expandable-cell>
								<smoothly-table-expandable-cell>
									{cat.coat}
									<div slot="detail">Pattern: {cat.pattern}</div>
								</smoothly-table-expandable-cell>
							</smoothly-table-row>
						))}
					</smoothly-table>,
			  ]
	}
}
