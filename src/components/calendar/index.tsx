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
	@Prop({ mutable: true }) month?: Date
	@Prop({ mutable: true }) value: Date = Date.now()
	@Event() valueChanged: EventEmitter<Date>
	render() {
		return [
			<smoothly-input-month
				value={this.month ?? this.value}
				onValueChanged={event => {
					this.month = event.detail
					event.stopPropagation()
				}}></smoothly-input-month>,
			<table>
				<thead>
					<tr>
						{generate.weekdays().map(day => (
							<th>{day}</th>
						))}
					</tr>
				</thead>
				{generate.month(this.month ?? this.value).map(week => (
					<tr>
						{week.map(date => (
							<td
								tabindex={1}
								onClick={() => this.valueChanged.emit((this.value = date))}
								class={(date == this.value ? ["selected"] : [])
									.concat(...(date == Date.now() ? ["today"] : []), date == this.value ? ["selected"] : [])
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
