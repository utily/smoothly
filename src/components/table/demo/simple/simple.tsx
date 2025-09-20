import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-demo-simple",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableDemoSimple {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-display type="text" value="Simple" />
				<smoothly-table color="primary" columns={2}>
					<smoothly-table-head>
						<smoothly-table-row>
							<smoothly-table-cell>Breed</smoothly-table-cell>
							<smoothly-table-cell>Coat</smoothly-table-cell>
						</smoothly-table-row>
					</smoothly-table-head>
					<smoothly-table-body>
						{cats.map(cat => (
							<smoothly-table-row>
								<smoothly-table-expandable-cell>
									{cat.breed}
									<div slot="detail">
										Country:
										<br />
										{cat.country}
									</div>
								</smoothly-table-expandable-cell>
								<smoothly-table-expandable-cell>
									{cat.coat}
									<div slot="detail">Pattern: {cat.pattern}</div>
								</smoothly-table-expandable-cell>
							</smoothly-table-row>
						))}
						<smoothly-table-row>
							<smoothly-table-cell>Cell5</smoothly-table-cell>
							<smoothly-table-expandable-cell>
								Expandable Cell
								<div slot={"detail"}>Content of the expandable cell</div>
							</smoothly-table-expandable-cell>
						</smoothly-table-row>
						<smoothly-table-row>
							<smoothly-table-expandable-cell>
								Expandable Cell 1<div slot={"detail"}>Content of the expandable cell 1</div>
							</smoothly-table-expandable-cell>
							<smoothly-table-expandable-cell>
								Expandable Cell 2<div slot={"detail"}>Content of the expandable cell 2</div>
							</smoothly-table-expandable-cell>
						</smoothly-table-row>
					</smoothly-table-body>
					<smoothly-table-foot>
						<smoothly-table-row>
							<smoothly-table-cell>Footer Cell</smoothly-table-cell>
							<smoothly-table-cell>Footer Cell</smoothly-table-cell>
						</smoothly-table-row>
					</smoothly-table-foot>
				</smoothly-table>
			</Host>
		)
	}
}
export interface Cat {
	breed: string
	country: string
	origin: string
	coat: string
	pattern: string
}
const cats: Cat[] = [
	{
		breed: "Abyssinian",
		country: "Ethiopia",
		origin: "Natural/Standard",
		coat: "Short",
		pattern: "Ticked",
	},
	{
		breed: "Aegean",
		country: "Greece",
		origin: "Natural/Standard",
		coat: "Semi-long",
		pattern: "Bi- or tri-colored",
	},
	{
		breed: "American Curl",
		country: "United States",
		origin: "Mutation",
		coat: "Short/Long",
		pattern: "All",
	},
	{
		breed: "American Bobtail",
		country: "United States",
		origin: "Mutation",
		coat: "Short/Long",
		pattern: "All",
	},
	{
		breed: "American Shorthair",
		country: "United States",
		origin: "Natural",
		coat: "Short",
		pattern: "All but colorpoint",
	},
	{
		breed: "American Wirehair",
		country: "United States",
		origin: "Mutation",
		coat: "Rex",
		pattern: "All but colorpoint",
	},
	{
		breed: "Arabian Mau",
		country: "Arabian Peninsula",
		origin: "Natural",
		coat: "Short",
		pattern: "",
	},
	{
		breed: "Australian Mist",
		country: "Australia",
		origin: "Crossbreed",
		coat: "Short",
		pattern: "Spotted and Classic tabby",
	},
	{
		breed: "Asian",
		country: "developed in the United Kingdom (founding stock from Asia)",
		origin: "",
		coat: "Short",
		pattern: "Evenly solid",
	},
	{
		breed: "Asian Semi-longhair",
		country: "United Kingdom",
		origin: "Crossbreed",
		coat: "Semi-long",
		pattern: "Solid",
	},
]
