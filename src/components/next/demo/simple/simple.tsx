import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-demo-simple",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextDemoSimple {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-display type="text" value="Simple" />
				<smoothly-color color="primary">
					<smoothly-next-table columns={2}>
						<smoothly-next-table-head>
							<smoothly-next-table-row>
								<smoothly-next-table-cell>Breed</smoothly-next-table-cell>
								<smoothly-next-table-cell>Coat</smoothly-next-table-cell>
							</smoothly-next-table-row>
						</smoothly-next-table-head>
						<smoothly-next-table-body>
							{cats.map(cat => (
								<smoothly-next-table-row>
									<smoothly-next-table-expandable-cell>
										{cat.breed}
										<div slot="detail">
											Country:
											<br />
											{cat.country}
										</div>
									</smoothly-next-table-expandable-cell>
									<smoothly-next-table-expandable-cell>
										{cat.coat}
										<div slot="detail">Pattern: {cat.pattern}</div>
									</smoothly-next-table-expandable-cell>
								</smoothly-next-table-row>
							))}
							<smoothly-next-table-expandable-row>
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
								<smoothly-next-table-cell>Cell1 in expandable row</smoothly-next-table-cell>
								<smoothly-next-table-cell>Cell2 in expandable row</smoothly-next-table-cell>
							</smoothly-next-table-expandable-row>
							<smoothly-next-table-row>
								<smoothly-next-table-cell>Cell5</smoothly-next-table-cell>
								<smoothly-next-table-expandable-cell>
									Expandable Cell
									<div slot={"detail"}>Content of the expandable cell</div>
								</smoothly-next-table-expandable-cell>
							</smoothly-next-table-row>
							<smoothly-next-table-row>
								<smoothly-next-table-expandable-cell>
									Expandable Cell 1<div slot={"detail"}>Content of the expandable cell 1</div>
								</smoothly-next-table-expandable-cell>
								<smoothly-next-table-expandable-cell>
									Expandable Cell 2<div slot={"detail"}>Content of the expandable cell 2</div>
								</smoothly-next-table-expandable-cell>
							</smoothly-next-table-row>
						</smoothly-next-table-body>
						<smoothly-next-table-foot>
							<smoothly-next-table-row>
								<smoothly-next-table-cell>Footer Cell</smoothly-next-table-cell>
								<smoothly-next-table-cell>Footer Cell</smoothly-next-table-cell>
							</smoothly-next-table-row>
						</smoothly-next-table-foot>
					</smoothly-next-table>
				</smoothly-color>
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
