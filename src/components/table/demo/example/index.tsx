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
	@State() senators?: data.Senator[]
	@State() filter?: selectively.Rule
	@State() expression = ""
	async componentWillLoad(): Promise<void> {
		const response = await http.fetch({
			url: "https://www.govtrack.us/api/v2/role?current=true&role_type=senator",
		})
		this.senators = ((await response.body) as data.RootObject).objects
	}

	render() {
		return !this.senators ? (
			<p>Loading data</p>
		) : (
			[
				<smoothly-input
					name="filter"
					onSmoothlyInput={event => {
						console.log("event", event.detail)
						this.expression = event.detail.value
					}}></smoothly-input>,
				<smoothly-input-date
					onValueChanged={event => (this.expression = `enddate:${event.detail}`)}></smoothly-input-date>,
				<smoothly-button
					onClick={
						event => (this.filter = selectively.parse(this.expression))
						// (this.filter = selectively.property("description", selectively.startsWith(this.expression)))
					}>
					Apply filter
				</smoothly-button>,
				<smoothly-table>
					<smoothly-table-row>
						<smoothly-table-header>Name</smoothly-table-header>
						<smoothly-table-header>Nickname</smoothly-table-header>
						<smoothly-table-header>Started</smoothly-table-header>
						<smoothly-table-header>Number of sessions of congress</smoothly-table-header>
					</smoothly-table-row>
					{(this.filter?.filter(this.senators) ?? this.senators).map(senator => (
						<smoothly-table-row>
							<smoothly-table-cell>
								{senator.person.firstname} {senator.person.lastname}
							</smoothly-table-cell>
							<smoothly-table-expandable-cell>
								{senator.person.nickname}
								<aside slot="detail">
									<p>{senator.description}</p>
								</aside>
							</smoothly-table-expandable-cell>
							<smoothly-table-cell>{senator.startdate}</smoothly-table-cell>
							<smoothly-table-cell>{senator.congress_numbers.length}</smoothly-table-cell>
						</smoothly-table-row>
					))}
				</smoothly-table>,
			]
		)
	}
}
