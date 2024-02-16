import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { Clearable } from "../../Clearable"
import { Input } from "../../Input"
import { Looks } from "../../Looks"
import { Color, Data } from "./../../../../model"

@Component({
	tag: "smoothly-input-date-range",
	styleUrl: "style.scss",
	scoped: true,
})
export class InputDateRange implements Clearable, Input {
	@Element() element: HTMLElement
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
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
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>

	@Method()
	async clear(): Promise<void> {
		this.start = undefined
		this.end = undefined
	}

	componentWillLoad() {
		this.smoothlyInputLooks.emit((looks, color) => ((this.looks = looks), !this.color && (this.color = color)))
		if (this.start && this.end)
			this.smoothlyInput.emit({ [this.name]: { start: this.start, end: this.end } })
	}
	@Watch("value")
	onValue(next: isoly.Date) {
		this.valueChanged.emit(next)
	}
	@Listen("smoothlyInput")
	smoothlyInputHandler(event: CustomEvent<Record<string, any>>) {
		if (event.target != this.element)
			event.stopPropagation()
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks: Looks) => void>) {
		if (event.target != this.element)
			event.stopPropagation()
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
		return (
			<Host tabindex={0}>
				<section onClick={() => (this.open = !this.open)}>
					<smoothly-input
						type="date"
						name="start"
						value={this.start}
						looks={this.looks}
						showLabel={this.showLabel}
						onSmoothlyInput={e => (this.start = e.detail.start)}>
						{`${this.labelStart}`}
					</smoothly-input>
					<span>–</span>
					<smoothly-input
						type="date"
						name="end"
						value={this.end}
						looks={this.looks}
						showLabel={this.showLabel}
						onSmoothlyInput={e => (this.end = e.detail.end)}>
						{`${this.labelEnd}`}
					</smoothly-input>
				</section>
				{this.open ? <div onClick={() => (this.open = false)}></div> : []}
				{this.open ? (
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
				)}
			</Host>
		)
	}
}
