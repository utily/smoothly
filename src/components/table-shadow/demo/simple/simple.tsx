import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-shadow-demo-simple",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableShadowDemoSimple {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-display type="text" value="Simple" />
				<smoothly-table color="primary" columns={2}>
					<smoothly-table-shadow-head>
						<smoothly-table-shadow-row>
							<smoothly-table-shadow-cell>Breed</smoothly-table-shadow-cell>
							<smoothly-table-shadow-cell>Coat</smoothly-table-shadow-cell>
						</smoothly-table-shadow-row>
					</smoothly-table-shadow-head>
					<smoothly-table-shadow-body>
						{cats.map(cat => (
							<smoothly-table-shadow-row>
								<smoothly-table-shadow-expandable-cell>
									{cat.breed}
									<div slot="detail">
										Country:
										<br />
										{cat.country}
									</div>
								</smoothly-table-shadow-expandable-cell>
								<smoothly-table-shadow-expandable-cell>
									{cat.coat}
									<div slot="detail">Pattern: {cat.pattern}</div>
								</smoothly-table-shadow-expandable-cell>
							</smoothly-table-shadow-row>
						))}
						<smoothly-table-shadow-expandable-row>
							<div slot={"detail"}>
								Content
								<br />
								of
								<br />
								the
								<br />
								expandable
								<br />
								row
							</div>
							<smoothly-table-shadow-cell>Cell1 in expandable row</smoothly-table-shadow-cell>
							<smoothly-table-shadow-cell>Cell2 in expandable row</smoothly-table-shadow-cell>
						</smoothly-table-shadow-expandable-row>
						<smoothly-table-shadow-row>
							<smoothly-table-shadow-cell>Cell5</smoothly-table-shadow-cell>
							<smoothly-table-shadow-expandable-cell>
								Expandable Cell
								<div slot={"detail"}>Content of the expandable cell</div>
							</smoothly-table-shadow-expandable-cell>
						</smoothly-table-shadow-row>
						<smoothly-table-shadow-row>
							<smoothly-table-shadow-expandable-cell>
								Expandable Cell 1<div slot={"detail"}>Content of the expandable cell 1</div>
							</smoothly-table-shadow-expandable-cell>
							<smoothly-table-shadow-expandable-cell>
								Expandable Cell 2<div slot={"detail"}>Content of the expandable cell 2</div>
							</smoothly-table-shadow-expandable-cell>
						</smoothly-table-shadow-row>
					</smoothly-table-shadow-body>
					<smoothly-table-shadow-foot>
						<smoothly-table-shadow-row>
							<smoothly-table-shadow-cell>Footer Cell</smoothly-table-shadow-cell>
							<smoothly-table-shadow-cell>Footer Cell</smoothly-table-shadow-cell>
						</smoothly-table-shadow-row>
					</smoothly-table-shadow-foot>
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
