import { Component, Element, Event, EventEmitter, h, Prop, Watch } from "@stencil/core"
import { Date } from "isoly"
import * as generate from "./generate"

@Component({
	tag: "smoothly-calendar",
	styleUrl: "style.css",
	scoped: true,
})
export class Calendar {
	@Element() element: HTMLTableRowElement
	@Prop({ mutable: true }) month: Date = Date.now()
	@Event() dateChanged: EventEmitter<Date>
	@Watch("month")
	onStart(next: Date) {
		this.dateChanged.emit(next)
	}
	render() {
		return [
			<smoothly-input-month value={this.month}></smoothly-input-month>,
			<table>
				<thead>
					<tr>
						{generate.weekdays().map(day => (
							<th>{day}</th>
						))}
					</tr>
				</thead>
				{generate.month(this.month).map(week => (
					<tr>
						{week.map(date => (
							<td
								tabindex={1}
								onClick={() => {
									this.month = date
								}}
								class={(date == this.month ? ["selected"] : [])
									.concat(...(date == Date.now() ? ["today"] : []), date == this.month ? ["selected"] : [])
									.join(" ")}>
								{date.substring(8, 10)}
							</td>
						))}
					</tr>
				))}
			</table>,
		]
	}
}
