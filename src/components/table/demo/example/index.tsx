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
	@State() filter: selectively.And = selectively.and()
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
					value={this.filter?.toString() ?? ""}
					onSmoothlyChange={event => {
						this.filter = selectively.parse(event.detail.value) as selectively.And
					}}>
					Filter
				</smoothly-input>,
				<smoothly-input-date
					onValueChanged={event =>
						(this.filter = selectively.and(
							selectively.property("person", selectively.property("birthday", selectively.greaterThan(event.detail)))
						))
					}>
					Born After
				</smoothly-input-date>,
				<smoothly-input-date
					value={
						(
							(
								this.filter.rules?.find(
									r => r.class == "property" && (r as selectively.Property | undefined)?.criteria.class == "greaterThan"
								) as selectively.Property | undefined
							)?.criteria as selectively.GreaterThan | undefined
						)?.value as string
					}
					onValueChanged={event =>
						(this.filter = selectively.and([
							...this.filter.rules.filter(
								r =>
									!(r.class == "property" && (r as selectively.Property | undefined)?.criteria.class == "greaterThan")
							),
							selectively.create({ enddate: selectively.greaterThan(event.detail) }),
						]))
					}>
					After
				</smoothly-input-date>,
				<smoothly-table>
					<smoothly-table-row>
						<smoothly-table-header>Name</smoothly-table-header>
						<smoothly-table-header>Nickname</smoothly-table-header>
						<smoothly-table-header>Started</smoothly-table-header>
						<smoothly-table-header>Number of sessions of congress</smoothly-table-header>
					</smoothly-table-row>
					{(this.filter?.filter(this.senators) ?? this.senators).map(senator => (
						<smoothly-table-row>
							<smoothly-table-expandable-cell>
								{senator.person.firstname} {senator.person.lastname}
								<aside slot="detail">
									<dl>
										<dt>bioguideid</dt>
										<dd>{senator.person.bioguideid}</dd>
										<dt>birthday</dt>
										<dd>{senator.person.birthday}</dd>
										<dt>cspanid</dt>
										<dd>{senator.person.cspanid}</dd>
										<dt>firstname</dt>
										<dd>{senator.person.firstname}</dd>
										<dt>gender</dt>
										<dd>{senator.person.gender}</dd>
										<dt>gender_label</dt>
										<dd>{senator.person.gender_label}</dd>
										<dt>lastname</dt>
										<dd>{senator.person.lastname}</dd>
										<dt>link</dt>
										<dd>{senator.person.link}</dd>
										<dt>middlename</dt>
										<dd>{senator.person.middlename}</dd>
										<dt>name</dt>
										<dd>{senator.person.name}</dd>
										<dt>namemod</dt>
										<dd>{senator.person.namemod}</dd>
										<dt>nickname</dt>
										<dd>{senator.person.nickname}</dd>
										<dt>osid</dt>
										<dd>{senator.person.osid}</dd>
										<dt>pvsid</dt>
										<dd>{senator.person.pvsid}</dd>
										<dt>sortname</dt>
										<dd>{senator.person.sortname}</dd>
										<dt>twitterid</dt>
										<dd>{senator.person.twitterid}</dd>
										<dt>youtubeid</dt>
										<dd>{senator.person.youtubeid}</dd>
									</dl>
								</aside>
							</smoothly-table-expandable-cell>
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
