import { Component, Event, EventEmitter, h, Listen, Prop, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { Data } from "./../../../../model"

@Component({
	tag: "smoothly-input-date-range",
	styleUrl: "style.scss",
	scoped: true,
})
export class InputDateRange {
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) value?: isoly.Date
	@Prop({ mutable: true }) start?: isoly.Date
	@Prop({ mutable: true }) end?: isoly.Date
	@Prop({ mutable: true }) max: isoly.Date
	@Prop({ mutable: true }) min: isoly.Date
	@Prop({ mutable: true }) open: boolean
	@Prop({ reflect: true }) showLabel = true
	@Prop() labelStart = "from"
	@Prop() labelEnd = "to"
	@Event() valueChanged: EventEmitter<isoly.Date>
	@Event() smoothlyInput: EventEmitter<Data>

	componentWillLoad() {
		if (this.start && this.end)
			this.smoothlyInput.emit({ [this.name]: { start: this.start, end: this.end } })
	}
	@Watch("value")
	onValue(next: isoly.Date) {
		this.valueChanged.emit(next)
	}
	@Listen("startChanged")
	onStartChanged(event: CustomEvent<isoly.Date>) {
		this.start = event.detail
	}
	@Listen("endChanged")
	onEndChanged(event: CustomEvent<isoly.Date>) {
		this.end = event.detail
	}
	@Listen("dateRangeSet")
	onDateRangeSet(event: CustomEvent<isoly.DateRange>) {
		this.open = false
		event.stopPropagation()
		isoly.DateRange.is(event.detail) && this.smoothlyInput.emit({ [this.name]: event.detail })
	}
	render() {
		return [
			<section onClick={() => (this.open = !this.open)}>
				<smoothly-input
					type="date"
					name="start"
					value={this.start}
					showLabel={this.showLabel}
					onSmoothlyInput={e => (this.start = e.detail.start) && e.stopPropagation()}>
					{`${this.labelStart}`}
				</smoothly-input>
				<span>–</span>
				<smoothly-input
					type="date"
					name="end"
					showLabel={this.showLabel}
					value={this.end}
					onSmoothlyInput={e => (this.end = e.detail.end) && e.stopPropagation()}>
					{`${this.labelEnd}`}
				</smoothly-input>
			</section>,
			this.open ? <div onClick={() => (this.open = false)}></div> : [],
			this.open ? (
				<nav>
					<div class="arrow"></div>
					<smoothly-calendar
						doubleInput={true}
						value={this.value ?? isoly.Date.now()}
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
