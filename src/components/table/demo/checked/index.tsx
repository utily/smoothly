import { Component, ComponentWillLoad, h, Listen, State } from "@stencil/core"
import * as http from "cloudly-http"
import { Root } from "../filtered/Root"

@Component({
	tag: "smoothly-table-demo-checked",
	styleUrl: "style.css",
	scoped: true,
})
export class TableDemoChecked implements ComponentWillLoad {
	@State() data?: Root // Root | False
	/* 	private checks: Map<EventTarget, () => void> = new Map() */

	@State() checked: Readonly<Record<string | number, any | undefined>> = {}

	async componentWillLoad(): Promise<void> {
		const response = await http.fetch("https://catfact.ninja/breeds?limit=10")
		this.data = response.status == 200 && (await response.body)
	}

	@Listen("smoothlyChecked")
	onSmoothlyChecked(event: CustomEvent<{ checked: boolean }>) {
		event.stopPropagation()
	}

	render() {
		const dataList = this.data?.data
		// console.log(this.checkAll)

		return !this.data
			? "Failed to load data."
			: [
					<smoothly-table>
						<smoothly-table-row>
							<smoothly-table-header>
								<smoothly-checkbox
									mid={
										dataList &&
										Object.keys(this.checked).length > 0 &&
										Object.keys(this.checked).length < dataList.length
									}
									checked={dataList && Object.keys(this.checked).length == dataList.length}
									onSmoothlyChecked={(event: CustomEvent<{ checked: boolean }>) => {
										dataList && event.detail.checked
											? (this.checked = Object.fromEntries(dataList.map(cat => [cat.breed, cat])))
											: (this.checked = {})
										console.log(this.checked) // logging correctly
									}}
								/>
							</smoothly-table-header>
							<smoothly-table-header>Breed</smoothly-table-header>
							<smoothly-table-header>Coat</smoothly-table-header>
						</smoothly-table-row>
						{this.data?.data.map(cat => {
							return (
								<smoothly-table-row>
									<smoothly-table-cell>
										<smoothly-checkbox
											name={cat.breed}
											value={cat}
											checked={this.checked[cat.breed]}
											onSmoothlyChecked={(event: CustomEvent<Record<string, boolean | any>>) => {
												const previous = this.checked
												console.log("event.detail", event.detail)
												this.checked = event.detail.checked
													? { ...this.checked, [cat.breed]: cat }
													: (({ [cat.breed]: _, ...data }) => data)(this.checked)
												console.log("compare:", previous, this.checked)
											}}></smoothly-checkbox>
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

//top checkbox needs to select all / de-select all.
