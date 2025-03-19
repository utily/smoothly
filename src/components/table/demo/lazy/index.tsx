import { Component, h, Host, VNode } from "@stencil/core"
import data from "./data.json"

@Component({
	tag: "smoothly-table-demo-lazy",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableDemoLazy {
	render(): VNode | VNode[] {
		const cats: Cat[] = Array.from({ length: 100 }).flatMap(() => data)

		return (
			<Host>
				<smoothly-display type="text" value="Lazy" />
				<smoothly-table color="primary" columns={2}>
					<smoothly-table-head>
						<smoothly-table-row>
							<smoothly-table-cell>Breed</smoothly-table-cell>
							<smoothly-table-cell>Coat</smoothly-table-cell>
						</smoothly-table-row>
					</smoothly-table-head>
					<smoothly-table-body>
						<smoothly-table-row-lazy
							data={cats}
							row={(cat: Cat, _, refCallback) => (
								<smoothly-table-row ref={refCallback}>
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
							)}
						/>
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
