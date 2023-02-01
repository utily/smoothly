import { Component, ComponentWillLoad, h, State } from "@stencil/core"
import * as http from "cloudly-http"
import { Root } from "../filtered/Root"

@Component({
	tag: "smoothly-table-demo-checked",
	styleUrl: "style.css",
	scoped: true,
})
export class TableDemoChecked implements ComponentWillLoad {
	@State() data?: Root | false

	async componentWillLoad(): Promise<void> {
		const response = await http.fetch("https://catfact.ninja/breeds?limit=10")
		this.data = response.status == 200 && (await response.body)
	}

	render() {
		const data = this.data
		return !data
			? "Failed to load data."
			: [
					<div>sketch</div>,
					<br />,
					<smoothly-table>
						<smoothly-table-row>
							<smoothly-table-header>
								<smoothly-checkbox />
							</smoothly-table-header>
							<smoothly-table-header>Breed</smoothly-table-header>
							<smoothly-table-header>Coat</smoothly-table-header>
						</smoothly-table-row>
						{data.data.map(cat => {
							return (
								<smoothly-table-row>
									<smoothly-table-cell>
										<smoothly-checkbox name={cat.breed} value={cat}></smoothly-checkbox>
									</smoothly-table-cell>
									<smoothly-table-cell>{cat.breed}</smoothly-table-cell>
									<smoothly-table-cell>{cat.coat}</smoothly-table-cell>
								</smoothly-table-row>
							)
						})}
					</smoothly-table>,
			  ]
	}
}
