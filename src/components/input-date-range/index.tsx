import { Component, Event, EventEmitter, h, Listen, Method, Prop, Watch } from "@stencil/core"
import { Date, DateRange } from "isoly"

@Component({
	tag: "smoothly-input-date-range",
	styleUrl: "style.scss",
	scoped: true,
})
export class InputDateRange {
	@Prop({ mutable: true }) value?: Date
	@Prop({ mutable: true }) start?: Date
	@Prop({ mutable: true }) end?: Date
	@Prop({ mutable: true }) max: Date
	@Prop({ mutable: true }) min: Date
	@Prop({ mutable: true }) open: boolean
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) showLabel = true
	@Prop() labelStart = "from"
	@Prop() labelEnd = "to"
	@Prop() clearable = false
	@Event() valueChanged: EventEmitter<Date>
	@Event() dateRangeClear: EventEmitter
	@Event() dateRangeSelected: EventEmitter<{ start: Date; end: Date }>

	@Watch("value")
	onValue(next: Date) {
		this.valueChanged.emit(next)
	}
	@Listen("startChanged")
	onStartChanged(event: CustomEvent<Date>) {
		this.start = event.detail
	}
	@Listen("endChanged")
	onEndChanged(event: CustomEvent<Date>) {
		this.end = event.detail
	}
	@Listen("dateRangeSet")
	onDateRangeSet(event: CustomEvent<DateRange>) {
		this.open = false
		event.stopPropagation()
		DateRange.is(event.detail) && this.dateRangeSelected.emit(event.detail)
	}
	@Method()
	async clear() {
		this.start = undefined
		this.end = undefined
		this.value = undefined
		this.dateRangeClear.emit()
	}

	render() {
		return [
			<section>
				<div onClick={() => (this.open = !this.disabled && !this.open)}>
					<smoothly-input
						type="date"
						value={this.start}
						showLabel={this.showLabel}
						onSmoothlyInput={e => (this.start = e.detail.value)}>
						{`${this.labelStart}`}
					</smoothly-input>
					<span>–</span>
					<smoothly-input
						type="date"
						showLabel={this.showLabel}
						value={this.end}
						onSmoothlyInput={e => (this.end = e.detail.value)}>
						{`${this.labelEnd}`}
					</smoothly-input>
				</div>
				{this.clearable && (
					<smoothly-icon name="close-circle" size="small" onClick={this.clear.bind(this)}></smoothly-icon>
				)}
			</section>,
			this.open ? <div onClick={() => (this.open = false)}></div> : [],
			this.open ? (
				<nav>
					<div class="arrow"></div>
					<smoothly-calendar
						doubleInput={true}
						value={this.value ?? Date.now()}
						onValueChanged={event => {
							this.value = event.detail
							event.stopPropagation()
						}}
						start={this.start}
						end={this.end}
						max={this.max}
						min={this.min}></smoothly-calendar>
				</nav>
			) : (
				[]
			),
		]
	}
}
