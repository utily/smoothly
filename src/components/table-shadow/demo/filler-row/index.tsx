import { Component, h, Host, State, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-shadow-demo-filler-row",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableShadowDemoFillerRow {
	@State() cats?: Cat[] = []

	async componentDidLoad(): Promise<void> {
		window.setTimeout(() => {
			this.cats = undefined
		}, 3000)
	}

	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-display type="text" value="Filler row" />
				<smoothly-table color="primary" columns={4}>
					<smoothly-table-head>
						<smoothly-table-row>
							<smoothly-table-cell>Breed</smoothly-table-cell>
							<smoothly-table-cell>Country</smoothly-table-cell>
							<smoothly-table-cell>Coat</smoothly-table-cell>
							<smoothly-table-cell>Origin</smoothly-table-cell>
						</smoothly-table-row>
					</smoothly-table-head>
					<smoothly-table-body>
						{this.cats === undefined ? (
							<smoothly-table-filler-row>No data to display</smoothly-table-filler-row>
						) : this.cats.length === 0 ? (
							<smoothly-table-filler-row>
								<smoothly-spinner style={{ margin: "auto" }} color="default" size="small" />
							</smoothly-table-filler-row>
						) : (
							this.cats.map(a => (
								<smoothly-table-row>
									<smoothly-table-cell>{a.breed}</smoothly-table-cell>
									<smoothly-table-cell>{a.country}</smoothly-table-cell>
									<smoothly-table-cell>{a.coat}</smoothly-table-cell>
									<smoothly-table-cell>{a.origin}</smoothly-table-cell>
								</smoothly-table-row>
							))
						)}
					</smoothly-table-body>
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
