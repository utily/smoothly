import { Component, h, Host, State, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-demo-filler-row-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextDemoFillerRowDemo {
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
				<smoothly-next-table color="primary" columns={4}>
					<smoothly-next-table-head>
						<smoothly-next-table-row>
							<smoothly-next-table-cell>Breed</smoothly-next-table-cell>
							<smoothly-next-table-cell>Country</smoothly-next-table-cell>
							<smoothly-next-table-cell>Coat</smoothly-next-table-cell>
							<smoothly-next-table-cell>Origin</smoothly-next-table-cell>
						</smoothly-next-table-row>
					</smoothly-next-table-head>
					<smoothly-next-table-body>
						{this.cats === undefined ? (
							<smoothly-next-table-filler-row>No data to display</smoothly-next-table-filler-row>
						) : this.cats.length === 0 ? (
							<smoothly-next-table-filler-row>
								<smoothly-spinner style={{ margin: "auto" }} color="default" size="small" />
							</smoothly-next-table-filler-row>
						) : (
							this.cats.map(a => (
								<smoothly-next-table-row>
									<smoothly-next-table-cell>{a.breed}</smoothly-next-table-cell>
									<smoothly-next-table-cell>{a.country}</smoothly-next-table-cell>
									<smoothly-next-table-cell>{a.coat}</smoothly-next-table-cell>
									<smoothly-next-table-cell>{a.origin}</smoothly-next-table-cell>
								</smoothly-next-table-row>
							))
						)}
					</smoothly-next-table-body>
				</smoothly-next-table>
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
