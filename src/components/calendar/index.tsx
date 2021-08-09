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
	@Prop({ mutable: true }) start?: Date
	@Prop({ mutable: true }) end?: Date
	@Prop({ reflect: true }) doubleInput: boolean
	@Event() valueChanged: EventEmitter<Date>
	@Event() startChanged: EventEmitter<Date>
	@Event() endChanged: EventEmitter<Date>
	@Watch("start")
	onStart(next: Date) {
		this.startChanged.emit(next)
	}
	@Watch("end")
	onEnd(next: Date) {
		this.endChanged.emit(next)
	}
	private clickCounter = 0
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
								onClick={() => {
									this.valueChanged.emit((this.value = date))
									this.clickCounter += 1
									if (this.clickCounter % 2 == 1)
										this.start = this.end = date
									else {
										if (this.start && date > this.start)
											this.end = date
										else
											this.start = date
									}
								}}
								class={(date == this.value ? ["selected"] : [])
									.concat(
										...(date == Date.now() ? ["today"] : []),
										date == this.value ? ["selected"] : [],
										this.doubleInput
											? Date.parse(date) >= Date.parse(this.start ?? "") &&
											  Date.parse(date) <= Date.parse(this.end ?? "")
												? ["dateRange"]
												: []
											: ""
									)
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
