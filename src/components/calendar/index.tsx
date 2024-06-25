import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from "@stencil/core"
import { Date, DateRange } from "isoly"
import * as generate from "./generate"

@Component({
	tag: "smoothly-calendar",
	styleUrl: "style.css",
	scoped: true,
})
export class Calendar {
	private frozenDate: Date
	@Element() element: HTMLTableRowElement
	@Prop({ mutable: true }) month?: Date
	@Prop({ mutable: true }) value: Date = Date.now()
	@Prop({ mutable: true }) start?: Date
	@Prop({ mutable: true }) end?: Date
	@Prop({ mutable: true }) max: Date
	@Prop({ mutable: true }) min: Date
	@Prop({ reflect: true }) doubleInput: boolean
	@Event() smoothlyValueChange: EventEmitter<Date>
	@Event() smoothlyStartChange: EventEmitter<Date>
	@Event() smoothlyEndChange: EventEmitter<Date>
	@Event() smoothlyDateSet: EventEmitter<Date>
	@Event() smoothlyDateRangeSet: EventEmitter<DateRange>
	@State() firstSelected: boolean
	@Watch("start")
	onStart(next: Date) {
		this.smoothlyStartChange.emit(next)
	}
	@Watch("end")
	onEnd(next: Date) {
		this.smoothlyEndChange.emit(next)
	}
	private clickCounter = 0
	private onClick(date: Date) {
		this.smoothlyValueChange.emit((this.value = date))
		this.clickCounter += 1
		if (this.doubleInput) {
			if (this.clickCounter % 2 == 1)
				this.start = this.end = this.frozenDate = date
			else {
				if (this.start && date > this.start)
					this.end = date
				else
					this.start = date
			}
		}
		!this.doubleInput && this.smoothlyDateSet.emit(this.value)
		this.doubleInput &&
			this.clickCounter % 2 == 0 &&
			this.start &&
			this.end &&
			this.smoothlyDateRangeSet.emit({ start: this.start, end: this.end })
	}
	private onHover(date: Date) {
		if (this.doubleInput && this.clickCounter % 2 == 1) {
			if (date < this.frozenDate) {
				this.start = date
				this.end = this.frozenDate
			} else {
				this.start = this.frozenDate
				this.end = date
			}
		}
	}
	render() {
		return [
			<smoothly-input-month
				name="month"
				value={this.month ?? this.value}
				next
				previous
				onSmoothlyInput={e => {
					e.stopPropagation()
					"month" in e.detail && typeof e.detail.month == "string" && (this.month = e.detail.month)
				}}>
				<div slot={"year-label"}>
					<slot name={"year-label"} />
				</div>
				<div slot={"month-label"}>
					<slot name={"month-label"} />
				</div>
			</smoothly-input-month>,
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
								onMouseOver={() => {
									!this.doubleInput && (this.min || this.max) && (date < this.min || date > this.max)
										? undefined
										: this.onHover(date)
								}}
								onClick={
									(this.min || this.max) && (date < this.min || date > this.max) ? undefined : () => this.onClick(date)
								}
								class={(date == this.value ? ["selected"] : [])
									.concat(
										...(date == Date.now() ? ["today"] : []),
										Date.firstOfMonth(this.month ?? this.value) == Date.firstOfMonth(date) ? ["currentMonth"] : [],
										this.doubleInput
											? this.start == date || this.end == date
												? ["selected"]
												: date >= (this.start ?? "") && date <= (this.end ?? "")
												? ["dateRange"]
												: []
											: ""
									)
									.concat(...(this.min || this.max ? (date < this.min || date > this.max ? ["disable"] : []) : ""))
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
