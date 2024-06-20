import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State } from "@stencil/core"
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
	// private changed: boolean = false
	@Element() element: HTMLElement
	@Prop() name: string = "dateRange"
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop({ reflect: true }) showLabel = true
	@Prop({ mutable: true }) start: isoly.Date | undefined = undefined
	@Prop({ mutable: true }) end: isoly.Date | undefined = undefined
	@Prop() max?: isoly.Date
	@Prop() min?: isoly.Date
	@State() open: boolean
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>

	componentWillLoad() {
		this.smoothlyInputLoad.emit(_ => {})
		this.smoothlyInputLooks.emit((looks, color) => ((this.looks = looks), !this.color && (this.color = color)))
		this.start && this.end && this.smoothlyInput.emit({ [this.name]: { start: this.start, end: this.end } })
	}

	inputHandler(data: Data) {
		const split = "dateRangeInput" in data && typeof data.dateRangeInput == "string" && data.dateRangeInput.split(" - ")
		if (split && split.length == 2 && isoly.Date.is(split[0]) && isoly.Date.is(split[1])) {
			this.start = split[0]
			this.end = split[1]
			// this.smoothlyInput.emit({ [this.name]: { start: this.start, end: this.end } })
		}
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks: Looks) => void>) {
		if (event.target != this.element)
			event.stopPropagation()
	}
	@Method()
	async clear(): Promise<void> {
		this.start = undefined
		this.end = undefined
	}
	render() {
		return (
			<Host tabindex={0}>
				<section onClick={() => (this.open = !this.open)}>
					<smoothly-input
						type="text" // TODO: date-range tidily thing
						name="dateRangeInput"
						value={`${this.start} - ${this.end}`}
						looks={this.looks}
						showLabel={this.showLabel}
						onSmoothlyInput={e => {
							e.stopPropagation()
							this.inputHandler(e.detail)
						}}
					/>
				</section>
				{this.open && <div onClick={() => (this.open = false)} />}
				{this.open && (
					<nav>
						<div class="arrow" />
						<smoothly-calendar
							doubleInput={true}
							onSmoothlyValueChange={e => e.stopPropagation()}
							onSmoothlyStartChange={e => {
								e.stopPropagation()
								console.log("start change")
								this.start = e.detail
							}}
							onSmoothlyEndChange={e => {
								e.stopPropagation()
								console.log("end change")
								this.end = e.detail
							}}
							onSmoothlyDateSet={e => e.stopPropagation()}
							onSmoothlyDateRangeSet={e => {
								e.stopPropagation()
								this.open = false
								console.log("date range set")

								this.smoothlyInput.emit({ [this.name]: e.detail })
							}}
							start={this.start}
							end={this.end}
							max={this.max}
							min={this.min}
						/>
					</nav>
				)}
			</Host>
		)
	}
}
