import { Component, ComponentWillLoad, h, Host, Listen, State } from "@stencil/core"
import { selectively } from "selectively"
import * as http from "cloudly-http"
import { Selector } from "../../Selector"
import { Cat, Root } from "./Root"

@Component({
	tag: "smoothly-table-demo-filtered",
	styleUrl: "style.css",
	scoped: true,
})
export class TableDemoFiltered implements ComponentWillLoad {
	@State() criteria: selectively.Criteria = {}
	@State() data?: Root | false
	@State() selector: Selector<Cat> = Selector.create("breed")
	@Listen("smoothlyFilter")
	onFilterUpdate(event: CustomEvent<selectively.Criteria>) {
		event.stopPropagation()
		this.criteria = event.detail
	}
	@Listen("smoothlyInput")
	smoothlyInputHandler(event: CustomEvent<Record<string, any>>) {
		event.stopPropagation()
		this.selector = this.selector.handle(event.detail)
	}
	async componentWillLoad(): Promise<void> {
		const response = await http.fetch("https://catfact.ninja/breeds?limit=10")
		this.data = response.status == 200 && (await response.body)
	}
	render() {
		const cats = this.data && selectively.filter(this.criteria, this.data.data)
		return (
			<Host>
				<smoothly-filter>
					<smoothly-filter-picker property="origin" slot="bar" multiple={false}>
						{this.data &&
							this.data.data.map(
								cat => cat.origin && <smoothly-picker-option value={cat.origin}>{cat.origin}</smoothly-picker-option>
							)}
					</smoothly-filter-picker>
					<smoothly-form looks="border" slot="detail">
						<smoothly-filter-input name="breed" placeholder="ex. Abyssinian">
							Breed
							<smoothly-icon slot="start" name="search-outline" size="small" />
						</smoothly-filter-input>
						<smoothly-filter-input name="country" placeholder="ex. Ethiopia">
							Country
							<smoothly-icon slot="start" name="search-outline" size="small" />
						</smoothly-filter-input>
						<smoothly-filter-input name="coat" placeholder="ex. Short">
							Coat
							<smoothly-icon slot="start" name="search-outline" size="small" />
						</smoothly-filter-input>
						<smoothly-filter-input name="pattern" placeholder="ex. Ticked">
							Pattern
							<smoothly-icon slot="start" name="search-outline" size="small" />
						</smoothly-filter-input>
					</smoothly-form>
				</smoothly-filter>
				{!cats ? (
					"Failed to load data."
				) : (
					<smoothly-table>
						<smoothly-table-row>
							<smoothly-table-header>{this.selector.render(cats)}</smoothly-table-header>
							<smoothly-table-header>Breed</smoothly-table-header>
							<smoothly-table-header>Coat</smoothly-table-header>
							<smoothly-table-header>Price</smoothly-table-header>
						</smoothly-table-row>
						{cats.map(cat => (
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
								<smoothly-table-cell>
									<smoothly-display
										type="price"
										value={[...cat.breed].reduce((r, c) => r + c.charCodeAt(0), 0)}
										currency="SEK"></smoothly-display>
								</smoothly-table-cell>
							</smoothly-table-row>
						))}
						<smoothly-table-footer>
							<td colSpan={5}>
								<smoothly-display
									type="text"
									value={`Selected: ${
										this.selector.selected.length != 0 ? this.selector.selected.length : cats ? cats.length : "?"
									}`}></smoothly-display>
							</td>
						</smoothly-table-footer>
					</smoothly-table>
				)}
			</Host>
		)
	}
}
