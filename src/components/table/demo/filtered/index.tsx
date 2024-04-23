import { Component, ComponentWillLoad, h, Host, Listen, State } from "@stencil/core"
import { selectively } from "selectively"
import * as http from "cloudly-http"
import { Selector } from "../../Selector"
import { Cat } from "./Root"

@Component({
	tag: "smoothly-table-demo-filtered",
	styleUrl: "style.css",
	scoped: true,
})
export class TableDemoFiltered implements ComponentWillLoad {
	@State() criteria: selectively.Criteria = {}
	@State() cats?: Cat[] | false
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
		const response = await http.fetch("https://catfact.ninja/breeds?limit=15")
		this.cats =
			response.status == 200 &&
			(await response.body).data.map((cat: any) => ({
				...cat,
				price: [...cat.breed].reduce((r, c) => r + c.charCodeAt(0), 0),
			}))
	}

	render() {
		const cats = this.cats && selectively.filter(this.criteria, this.cats)
		return (
			<Host>
				<smoothly-filter>
					<smoothly-filter-toggle
						properties={{ pattern: "Ticked", breed: "" }}
						icon="paw"
						toolTip="Ticked cats"
						slot="bar"
					/>
					<smoothly-filter-toggle
						properties={{ breed: "Bombay", pattern: "Solid" }}
						icon="radio-button-on"
						toolTip="Solid bombay cats"
						slot="bar"
					/>
					<smoothly-filter-toggle
						properties={{ pattern: "Colorpoint" }}
						not
						active
						icon="alert"
						toolTip="Colored cats"
						slot="bar"
					/>
					<smoothly-filter-picker property="coat" slot="bar" multiple={false}>
						{this.cats &&
							this.cats.map(
								cat => cat.coat && <smoothly-picker-option value={cat.coat}>{cat.coat}</smoothly-picker-option>
							)}
					</smoothly-filter-picker>
					<div slot="detail">
						<smoothly-form looks="border">
							<smoothly-filter-picker property="breed" multiple={false}>
								{this.cats &&
									this.cats.map(
										cat => cat.breed && <smoothly-picker-option value={cat.breed}>{cat.breed}</smoothly-picker-option>
									)}
							</smoothly-filter-picker>
							<smoothly-filter-input property="coat" />
						</smoothly-form>
					</div>
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
