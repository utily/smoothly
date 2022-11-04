import { Component, ComponentWillLoad, h, State } from "@stencil/core"
import * as selectively from "selectively"
import * as http from "cloudly-http"
import * as data from "./data"

@Component({
	tag: "smoothly-table-demo-example",
	styleUrl: "style.css",
	scoped: true,
})
export class TableDemoExample implements ComponentWillLoad {
	@State() programs?: data.Program[]
	@State() filter?: selectively.Rule
	async componentWillLoad(): Promise<void> {
		const response = await http.fetch({
			url: "http://api.sr.se/api/v2/programs?format=json&size=100",
		})
		this.programs = ((await response.body) as data.Programs).programs
	}

	render() {
		return !this.programs ? (
			<p>Loading data</p>
		) : (
			[
				<smoothly-input
					name="filter"
					onSmoothlyInput={event => {
						console.log("event", event.detail)
						this.filter = selectively.property("email", selectively.startsWith(event.detail.value))
					}}></smoothly-input>,
				<smoothly-table>
					<smoothly-table-row>
						<smoothly-table-header>Channel</smoothly-table-header>
						<smoothly-table-header>Program</smoothly-table-header>
					</smoothly-table-row>
					{(this.filter?.filter(this.programs) ?? this.programs).map(program => (
						<smoothly-table-row>
							<smoothly-table-cell>{program.channel.name}</smoothly-table-cell>
							<smoothly-table-expandable-cell>
								{program.name}
								<aside slot="detail">
									<p>{program.description}</p>
								</aside>
							</smoothly-table-expandable-cell>
						</smoothly-table-row>
					))}
				</smoothly-table>,
			]
		)
	}
}
