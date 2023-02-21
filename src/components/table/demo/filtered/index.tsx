import { Component, ComponentWillLoad, h, Listen, State } from "@stencil/core"
import * as selectively from "selectively"
import { Criteria } from "selectively"
import * as http from "cloudly-http"
import { Selector } from "../../Selector"
import { Cat, Root } from "./Root"

@Component({
	tag: "smoothly-table-demo-filtered",
	styleUrl: "style.css",
	scoped: true,
})
export class TableDemoFiltered implements ComponentWillLoad {
	@State() criteria: Criteria = {}
	@State() data?: Root | false
	@State() selector: Selector<Cat> = Selector.create("breed")

	@Listen("smoothlyFilter")
	onFilterUpdate(event: CustomEvent<Record<string, Criteria>>) {
		event.stopPropagation()
		this.criteria = event.detail
	}
	@Listen("smoothlyChecked", { capture: true })
	smoothlyCheckedHandler(event: CustomEvent<Record<string, any>>) {
		this.selector = this.selector.handle(event.detail)
	}
	async componentWillLoad(): Promise<void> {
		const response = await http.fetch("https://catfact.ninja/breeds?limit=10")
		this.data = response.status == 200 && (await response.body)
	}

	render() {
		const data = this.data && selectively.filter(this.criteria, this.data.data)
		return !data
			? "Failed to load data."
			: [
					<smoothly-form looks="border">
						<smoothly-filter>
							<smoothly-icon slot="start" name="search-outline" size="small" />
							Filter
							<smoothly-form slot="filter" looks="grid">
								<smoothly-filter-input name="breed" placeholder="ex. Abyssinian">
									Breed
								</smoothly-filter-input>
								<smoothly-filter-input name="country" placeholder="ex. Ethiopia">
									Country
								</smoothly-filter-input>
								<smoothly-filter-input name="coat" placeholder="ex. Short">
									Coat
								</smoothly-filter-input>
								<smoothly-filter-input name="pattern" placeholder="ex. Ticked">
									Pattern
								</smoothly-filter-input>
							</smoothly-form>
						</smoothly-filter>
					</smoothly-form>,
					<smoothly-table>
						<smoothly-table-row>
							<smoothly-table-header>{this.selector.render(data)}</smoothly-table-header>
							<smoothly-table-header>Breed</smoothly-table-header>
							<smoothly-table-header>Coat</smoothly-table-header>
						</smoothly-table-row>
						{data.map(cat => (
							<smoothly-table-row>
								<smoothly-table-cell>{this.selector.render(cat)}</smoothly-table-cell>
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
