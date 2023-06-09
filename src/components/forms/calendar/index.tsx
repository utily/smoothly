import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch } from "@stencil/core"
import { Date, DateRange } from "isoly"
import Calendar from "./Calendar"

@Component({
	tag: "smoothly-calendar-new",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyCalendarNew {
	@Prop({ mutable: true }) value: string
	@Prop({ mutable: true }) start?: Date
	@Prop({ mutable: true }) end?: Date
	@Prop({ mutable: true }) max: Date
	@Prop({ mutable: true }) min: Date
	@Prop({ reflect: true }) doubleInput: boolean
	@State() firstSelected: boolean
	@Event() valueChanged: EventEmitter<Date>
	@Event() startChanged: EventEmitter<Date>
	@Event() endChanged: EventEmitter<Date>
	@Event() dateSet: EventEmitter<Date>
	@Event() dateRangeSet: EventEmitter<DateRange>
	@Element() element: HTMLTableRowElement
	private frozenDate: Date
	private clickCounter = 0
	private monthSelect?: HTMLSmoothlySelectNewElement
	private yearSelect?: HTMLSmoothlySelectNewElement

	@Watch("start")
	onStart(next: Date) {
		this.startChanged.emit(next)
	}

	@Watch("end")
	onEnd(next: Date) {
		this.endChanged.emit(next)
	}

	private onClick(date: Date) {
		this.valueChanged.emit((this.value = date))
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
		!this.doubleInput && this.dateSet.emit(this.value)
		this.doubleInput &&
			this.clickCounter % 2 == 0 &&
			this.start &&
			this.end &&
			this.dateRangeSet.emit({ start: this.start, end: this.end })
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

	private onChangeMonth(e: string) {
		const current = this.value.split("-")
		current[1] = e
		this.value = current.join("-")
	}

	private onChangeYear(e: string) {
		const current = this.value.split("-")
		current[0] = e
		this.value = current.join("-")
	}

	render() {
		return (
			<Host>
				<div class="month-container">
					<div class="month-content">
						<div class="calendar-arrow" onClick={() => (this.value = Calendar.adjustYear(this.value, -1))}>
							<smoothly-icon name="chevron-back-outline" size="small"></smoothly-icon>
						</div>
						<div
							class="input-label"
							onClick={async () => (this.yearSelect?.querySelector(".input-container") as HTMLDivElement)?.click()}>
							{this.value.split("-")[0]}
						</div>
						<smoothly-select-new
							value={this.value.split("-")[0]}
							name="year"
							layout="plain"
							transparent
							options={Calendar.years()}
							onSmoothlyInput={(e: CustomEvent) => {
								e.stopPropagation()
								this.onChangeYear(e.detail.year)
							}}
							onSmoothlyChange={e => e.stopPropagation()}
							onSmoothlyInputLoad={e => e.stopPropagation()}
							ref={e => (this.yearSelect = e)}
						/>
						<div class="calendar-arrow" onClick={() => (this.value = Calendar.adjustYear(this.value, 1))}>
							<smoothly-icon name="chevron-forward-outline" size="small"></smoothly-icon>
						</div>
					</div>
					<div class="month-content">
						<div class="calendar-arrow" onClick={() => (this.value = Calendar.adjustMonth(this.value, -1))}>
							<smoothly-icon name="chevron-back-outline" size="small"></smoothly-icon>
						</div>
						<div
							class="input-label"
							onClick={async () => (this.monthSelect?.querySelector(".input-container") as HTMLDivElement)?.click()}>
							{Calendar.getMonthLabel(this.value)}
						</div>
						<smoothly-select-new
							value={this.value.split("-")[1]}
							name="month"
							layout="plain"
							transparent
							options={Calendar.months()}
							onSmoothlyInput={(e: CustomEvent) => {
								e.stopPropagation()
								this.onChangeMonth(e.detail.month)
							}}
							onSmoothlyChange={e => e.stopPropagation()}
							onSmoothlyInputLoad={e => e.stopPropagation()}
							ref={e => (this.monthSelect = e)}
						/>
						<div class="calendar-arrow" onClick={() => (this.value = Calendar.adjustMonth(this.value, 1))}>
							<smoothly-icon name="chevron-forward-outline" size="small"></smoothly-icon>
						</div>
					</div>
				</div>

				<table>
					<thead>
						<tr>
							{Calendar.weekdays().map(day => (
								<th>{day}</th>
							))}
						</tr>
					</thead>
					{Calendar.month(this.value).map(week => (
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
										(this.min || this.max) && (date < this.min || date > this.max)
											? undefined
											: () => this.onClick(date)
									}
									class={(date == this.value ? ["selected"] : [])
										.concat(
											...(date == Date.now() ? ["today"] : []),
											Date.firstOfMonth(this.value) == Date.firstOfMonth(date) ? ["currentMonth"] : [],
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
				</table>
			</Host>
		)
	}
}
