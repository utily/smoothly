import { Component, ComponentWillLoad, h, Host, Listen, State } from "@stencil/core"
import { selectively } from "selectively"
import { http } from "cloudly-http"
import { Selector } from "../../../table/Selector"
import { Cat } from "./Root"

@Component({
	tag: "smoothly-next-table-demo-filtered",
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
				nested: { ...cat, names: names[cat.country] ?? [] },
				names: names[cat.country] ?? [],
			}))
	}

	render() {
		const cats = this.cats && selectively.filter(this.criteria, this.cats)
		return (
			<Host>
				<smoothly-display type="text" value="Filtered" />
				<smoothly-filter>
					<smoothly-filter-toggle
						properties={{ ["nested.pattern"]: "Ticked", breed: "" }}
						icon="add"
						toolTip="Nested Ticked"
						slot="bar"
					/>
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
					<smoothly-filter-picker label="coat" property="nested.coat" slot="bar" multiple={false}>
						{this.cats &&
							this.cats.map(
								cat =>
									cat.nested?.coat && (
										<smoothly-picker-option value={cat.nested.coat}>{cat.nested.coat}</smoothly-picker-option>
									)
							)}
					</smoothly-filter-picker>
					<div slot="detail">
						<smoothly-form looks="border">
							<smoothly-filter-picker label="coat" property="nested.coat" multiple>
								{this.cats &&
									this.cats.map(
										cat =>
											cat.nested?.coat && (
												<smoothly-picker-option value={cat.nested.coat}>{cat.nested.coat}</smoothly-picker-option>
											)
									)}
							</smoothly-filter-picker>
							<smoothly-filter-picker label="breed" property="breed" multiple={false}>
								{this.cats &&
									this.cats.map(
										cat => cat.breed && <smoothly-picker-option value={cat.breed}>{cat.breed}</smoothly-picker-option>
									)}
							</smoothly-filter-picker>
							<smoothly-filter-picker label="names" property="nested.names" multiple={true} type="array">
								{Object.values(names).flatMap(names =>
									names.map(name => <smoothly-picker-option value={name}>{name}</smoothly-picker-option>)
								)}
							</smoothly-filter-picker>

							<smoothly-filter-input property="coat" placeholder="ex. Short" />
							<smoothly-filter-input property="nested.coat" placeholder="ex. Rex" />
						</smoothly-form>
					</div>
				</smoothly-filter>
				{!cats ? (
					"Failed to load data."
				) : (
					<smoothly-next-table columns={4}>
						<smoothly-next-table-head>
							<smoothly-next-table-row>
								<smoothly-next-table-cell>{this.selector.render(cats)}</smoothly-next-table-cell>
								<smoothly-next-table-cell>Breed</smoothly-next-table-cell>
								<smoothly-next-table-cell>Coat</smoothly-next-table-cell>
								<smoothly-next-table-cell>Price</smoothly-next-table-cell>
							</smoothly-next-table-row>
						</smoothly-next-table-head>
						{cats.map(cat => (
							<smoothly-next-table-row>
								<smoothly-next-table-cell>{this.selector.render(cat)}</smoothly-next-table-cell>
								<smoothly-next-table-expandable-cell>
									{cat.breed}
									<div slot="detail">Country: {cat.country}</div>
								</smoothly-next-table-expandable-cell>
								<smoothly-next-table-expandable-cell>
									{cat.coat}
									<div slot="detail">Pattern: {cat.pattern}</div>
								</smoothly-next-table-expandable-cell>
								<smoothly-next-table-cell>
									<smoothly-display type="price" value={cat.price} currency="SEK"></smoothly-display>
								</smoothly-next-table-cell>
							</smoothly-next-table-row>
						))}
						<smoothly-next-table-foot>
							<smoothly-next-table-row>
								<smoothly-next-table-cell span={3}>
									<smoothly-display
										type="text"
										value={`Selected: ${
											this.selector.selected.length != 0 ? this.selector.selected.length : cats ? cats.length : "?"
										}`}></smoothly-display>
								</smoothly-next-table-cell>
							</smoothly-next-table-row>
						</smoothly-next-table-foot>
					</smoothly-next-table>
				)}
			</Host>
		)
	}
}
const names: Record<string, string[]> = {
	"United States": ["bill", "bob", "brad", "joe", "molly"],
	Australia: ["nigel", "bruce", "sheila", "brad", "shane"],
	"United Kingdom": ["nigel", "james", "molly", "shane", "bob"],
	Greece: ["dionysius", "demetrius", "polikarpos"],
}
