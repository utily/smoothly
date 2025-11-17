import { Component, Element, Event, EventEmitter, Fragment, h, Method, Prop, State, Watch } from "@stencil/core"
import { isoly } from "isoly"
import * as generate from "./generate"

@Component({
	tag: "smoothly-calendar",
	styleUrl: "style.css",
	scoped: true,
})
export class Calendar {
	private frozenDate: isoly.Date
	@Element() element: HTMLTableRowElement
	@Prop({ mutable: true }) month?: isoly.Date
	@Prop({ mutable: true }) value?: isoly.Date
	@Prop({ mutable: true }) start?: isoly.Date
	@Prop({ mutable: true }) end?: isoly.Date
	@Prop({ mutable: true }) max: isoly.Date
	@Prop({ mutable: true }) min: isoly.Date
	@Prop({ reflect: true }) doubleInput: boolean
	@Event() smoothlyValueChange: EventEmitter<isoly.Date>
	@Event() smoothlyStartChange: EventEmitter<isoly.Date>
	@Event() smoothlyEndChange: EventEmitter<isoly.Date>
	@Event() smoothlyDateSet: EventEmitter<isoly.Date>
	@Event() smoothlyDateRangeSet: EventEmitter<isoly.DateRange>
	@State() firstSelected: boolean
	@Watch("start")
	onStart(next: isoly.Date) {
		this.smoothlyStartChange.emit(next)
	}
	@Watch("end")
	onEnd(next: isoly.Date) {
		this.smoothlyEndChange.emit(next)
	}
	@Method()
	async jumpTo(yearMonth: { Y?: string; M?: string }) {
		const year = isoly.Date.Year.is(yearMonth.Y)
			? yearMonth.Y
			: this.month?.substring(0, 4) ?? isoly.Date.now().substring(0, 4)
		const mon = isoly.Date.Month.is(yearMonth.M)
			? yearMonth.M
			: this.month?.substring(5, 7) ?? isoly.Date.now().substring(5, 7)
		const date = `${year}-${mon}-01`
		if (isoly.Date.is(date))
			this.month = date
	}

	private clickCounter = 0
	private onClick(date: isoly.Date) {
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
	private onHover(date: isoly.Date) {
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
	private withinLimit(date: isoly.Date) {
		return (!this.min || date >= this.min) && (!this.max || date <= this.max)
	}
	render() {
		return (
			<Fragment>
				<smoothly-input-month
					name="month"
					value={this.month ?? this.value}
					min={this.min}
					max={this.max}
					inCalendar
					next
					previous
					showLabel={false}
					onSmoothlyInput={e => {
						e.stopPropagation()
						"month" in e.detail && typeof e.detail.month == "string" && (this.month = e.detail.month)
					}}
					onSmoothlyUserInput={e => e.stopPropagation()}>
					<div slot={"year-label"}>
						<slot name={"year-label"} />
					</div>
					<div slot={"month-label"}>
						<slot name={"month-label"} />
					</div>
				</smoothly-input-month>
				<table>
					<thead>
						<tr>
							{generate.weekdays().map(day => (
								<th>{day}</th>
							))}
						</tr>
					</thead>
					{generate.month(this.month ?? this.value ?? isoly.Date.now()).map(week => (
						<tr>
							{week.map(date => (
								<td
									tabindex={1}
									onMouseOver={() => (this.withinLimit(date) ? this.onHover(date) : undefined)}
									onClick={this.withinLimit(date) ? () => this.onClick(date) : undefined}
									class={{
										selected: date == this.value || (this.doubleInput && (date == this.start || date == this.end)),
										today: date == isoly.Date.now(),
										currentMonth:
											isoly.Date.firstOfMonth(this.month ?? this.value ?? isoly.Date.now()) ==
											isoly.Date.firstOfMonth(date),
										dateRange: this.doubleInput && date > (this.start ?? "") && date < (this.end ?? ""),
										disable: !this.withinLimit(date),
									}}>
									{date.substring(8, 10)}
								</td>
							))}
						</tr>
					))}
				</table>
			</Fragment>
		)
	}
}
