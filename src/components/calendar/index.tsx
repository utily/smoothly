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
	@Prop({ mutable: true }) max?: Date
	@Prop({ mutable: true }) min?: Date
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
	private onClick(date: Date) {
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
	}
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
								onClick={
									!(Date.parse(date) <= Date.parse(this.min ?? "") || Date.parse(date) >= Date.parse(this.max ?? ""))
										? () => this.onClick(date)
										: undefined
								}
								class={(date == this.value ? ["selected"] : [])
									.concat(
										...(date == Date.now() ? ["today"] : []),
										Date.firstOfMonth(this.month ?? this.value) == Date.firstOfMonth(date) ? ["currentMonth"] : [],
										this.doubleInput
											? Date.parse(date) >= Date.parse(this.start ?? "") &&
											  Date.parse(date) <= Date.parse(this.end ?? "")
												? ["dateRange"]
												: []
											: ""
									)
									.concat(...(date <= (this.min ?? "") || date >= (this.max ?? "") ? ["disable"] : []))
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
