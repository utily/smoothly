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
	@Prop() start?: isoly.Date
	@Prop() end?: isoly.Date
	@Prop({ mutable: true }) max: isoly.Date
	@Prop({ mutable: true }) min: isoly.Date
	@Prop({ reflect: true }) doubleInput: boolean
	@State() startInternal?: isoly.Date
	@State() endInternal?: isoly.Date
	@Event() smoothlyDateSet: EventEmitter<isoly.Date>
	@Event() smoothlyDateRangeSet: EventEmitter<isoly.DateRange>

	componentWillLoad() {
		this.onStart()
		this.onEnd()
	}
	@Watch("start")
	onStart() {
		this.startInternal = this.start
	}
	@Watch("end")
	onEnd() {
		this.endInternal = this.end
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
		this.value = date
		this.smoothlyDateSet.emit(this.value)
	}
	private onClickDoubleInput(date: isoly.Date) {
		this.clickCounter += 1
		if (this.clickCounter % 2 == 1) {
			this.startInternal = this.endInternal = this.frozenDate = date
		} else {
			const start = this.startInternal! > date ? date : this.startInternal
			const end = this.endInternal! < date ? date : this.endInternal
			this.startInternal = start
			this.endInternal = end
		}
		this.clickCounter % 2 == 0 &&
			this.startInternal &&
			this.endInternal &&
			this.smoothlyDateRangeSet.emit({ start: this.startInternal, end: this.endInternal })
	}
	private onHover(date: isoly.Date) {
		if (this.doubleInput && this.clickCounter % 2 == 1) {
			if (date < this.frozenDate) {
				this.startInternal = date
				this.endInternal = this.frozenDate
			} else {
				this.startInternal = this.frozenDate
				this.endInternal = date
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
									onMouseOver={this.withinLimit(date) ? () => this.onHover(date) : undefined}
									onClick={
										this.withinLimit(date)
											? () => (this.doubleInput ? this.onClickDoubleInput(date) : this.onClick(date))
											: undefined
									}
									class={{
										selected:
											date == this.value ||
											(this.doubleInput && (date == this.startInternal || date == this.endInternal)),
										today: date == isoly.Date.now(),
										currentMonth:
											isoly.Date.firstOfMonth(this.month ?? this.value ?? isoly.Date.now()) ==
											isoly.Date.firstOfMonth(date),
										dateRange: this.doubleInput && date > (this.startInternal ?? "") && date < (this.endInternal ?? ""),
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
