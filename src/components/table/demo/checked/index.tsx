import { Component, ComponentWillLoad, h, Listen, Prop, State } from "@stencil/core"
import * as http from "cloudly-http"
import { Root } from "../filtered/Root"

@Component({
	tag: "smoothly-table-demo-checked",
	styleUrl: "style.css",
	scoped: true,
})
export class TableDemoChecked implements ComponentWillLoad {
	@State() data?: Root // Root | False
	private checks: Map<EventTarget, () => void> = new Map()
	@Prop({ mutable: true, reflect: true }) state: "none" | "intermediate" | "all" = "none" // to mark if all are selected or not

	async componentWillLoad(): Promise<void> {
		const response = await http.fetch("https://catfact.ninja/breeds?limit=10")
		this.data = response.status == 200 && (await response.body)
	}

	@Listen("smoothlyChecked")
	onSmoothlyChecked(event: CustomEvent<Record<string, boolean | any>>) {
		event.stopPropagation()
		event.target && this.checks.set(event.target, () => (event.target as HTMLSmoothlyCheckboxElement).toggle())
		console.log("checks:", this.checks)
		console.log(this.checks.size)
		if (this.data !== undefined) {
			this.state = this.checks.size < 1 ? "none" : this.data?.data.length > this.checks.size ? "intermediate" : "all"
		}
	}

	render() {
		// const data = this.data

		return !this.data
			? "Failed to load data."
			: [
					<smoothly-table>
						<smoothly-table-row>
							<smoothly-table-header>
								<smoothly-checkbox state={this.state} />
							</smoothly-table-header>
							<smoothly-table-header>Breed</smoothly-table-header>
							<smoothly-table-header>Coat</smoothly-table-header>
						</smoothly-table-row>
						{this.data?.data.map(cat => {
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

//top checkbox needs to select all / de-select all.
