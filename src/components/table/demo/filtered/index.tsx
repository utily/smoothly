import { Component, ComponentWillLoad, h, Host, Listen, State } from "@stencil/core"
import { selectively } from "selectively"
import { http } from "cloudly-http"
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
					<smoothly-filter-select menuHeight="5items" label="coat" property="nested.coat" slot="bar" multiple={false}>
						{this.cats &&
							Object.values(
								this.cats.reduce<Record<string, Cat>>(
									(r, cat) => (cat.nested ? { ...r, [cat.nested.coat]: cat } : r),
									{}
								)
							).map(
								cat =>
									cat.nested?.coat && (
										<smoothly-item slot="items" value={cat.nested.coat}>
											{cat.nested.coat}
										</smoothly-item>
									)
							)}
					</smoothly-filter-select>
					<div slot="detail">
						<smoothly-form looks="border">
							<smoothly-filter-select menuHeight="5items" label="coat" property="nested.coat" multiple>
								{this.cats &&
									Object.values(
										this.cats.reduce<Record<string, Cat>>(
											(r, cat) => (cat.nested ? { ...r, [cat.nested.coat]: cat } : r),
											{}
										)
									).map(
										cat =>
											cat.nested?.coat && (
												<smoothly-item slot="items" value={cat.nested.coat}>
													{cat.nested.coat}
												</smoothly-item>
											)
									)}
							</smoothly-filter-select>
							<smoothly-filter-select menuHeight="5items" label="breed" property="breed" multiple={false}>
								{this.cats &&
									Object.values(
										this.cats.reduce<Record<string, Cat>>((r, cat) => (cat.breed ? { ...r, [cat.breed]: cat } : r), {})
									).map(
										cat =>
											cat.breed && (
												<smoothly-item slot="items" value={cat.breed}>
													{cat.breed}
												</smoothly-item>
											)
									)}
							</smoothly-filter-select>
							<smoothly-filter-select
								menuHeight="5items"
								label="names"
								property="nested.names"
								multiple={true}
								type="array">
								{Object.keys(
									Object.values(names)
										.flat()
										.reduce((r, name) => ({ ...r, [name]: true }), {})
								).flatMap(name => (
									<smoothly-item slot="items" value={name}>
										{name}
									</smoothly-item>
								))}
							</smoothly-filter-select>
							<smoothly-filter-input label="Coat" property="coat" />
							<smoothly-filter-input label="Nested Coat" property="nested.coat" />
						</smoothly-form>
					</div>
				</smoothly-filter>
				{!cats ? (
					"Failed to load data."
				) : (
					<smoothly-table columns={4}>
						<smoothly-table-head>
							<smoothly-table-row>
								<smoothly-table-cell>{this.selector.render(cats)}</smoothly-table-cell>
								<smoothly-table-cell>Breed</smoothly-table-cell>
								<smoothly-table-cell>Coat</smoothly-table-cell>
								<smoothly-table-cell>Price</smoothly-table-cell>
							</smoothly-table-row>
						</smoothly-table-head>
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
									<smoothly-display type="price" value={cat.price} currency="SEK" />
								</smoothly-table-cell>
							</smoothly-table-row>
						))}
						<smoothly-table-foot>
							<smoothly-table-row>
								<smoothly-table-cell span={3}>
									<smoothly-display
										type="text"
										value={`Selected: ${
											this.selector.selected.length != 0 ? this.selector.selected.length : cats ? cats.length : "?"
										}`}
									/>
								</smoothly-table-cell>
							</smoothly-table-row>
						</smoothly-table-foot>
					</smoothly-table>
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
