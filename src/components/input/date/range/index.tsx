import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { Clearable } from "../../Clearable"
import { Editable } from "../../Editable"
import { Input } from "../../Input"
import { Looks } from "../../Looks"
import { Color, Data } from "./../../../../model"

@Component({
	tag: "smoothly-input-date-range",
	styleUrl: "style.scss",
	scoped: true,
})
export class SmoothlyInputDateRange implements Clearable, Input, Editable {
	@Element() element: HTMLElement
	@Prop() name: string = "dateRange"
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ reflect: true }) showLabel = true
	@Prop({ mutable: true }) start: isoly.Date | undefined
	@Prop({ mutable: true }) end: isoly.Date | undefined
	@Prop() placeholder = "from — to"
	@Prop() max?: isoly.Date
	@Prop() min?: isoly.Date
	@Prop({ mutable: true }) changed = false
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	private initialStart?: isoly.Date
	private initialEnd?: isoly.Date
	@State() value?: isoly.DateRange
	@State() open: boolean
	@Event() smoothlyInput: EventEmitter<{ [name: string]: isoly.DateRange | undefined }>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>

	componentWillLoad() {
		this.setInitialValue()
		this.updateValue()
		this.smoothlyInputLoad.emit(_ => {})
		this.smoothlyInputLooks.emit((looks, color) => ((this.looks = looks), !this.color && (this.color = color)))
		this.start && this.end && this.smoothlyInput.emit({ [this.name]: { start: this.start, end: this.end } })
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
	}
	// TODO: disable search fields in month selectors so that the input becomes typeable and then fix input handler
	inputHandler(data: Data) {
		const split = "dateRangeInput" in data && typeof data.dateRangeInput == "string" && data.dateRangeInput.split(" - ")
		if (split && split.length == 2 && isoly.Date.is(split[0]) && isoly.Date.is(split[1])) {
			this.start = split[0]
			this.end = split[1]
		}
	}
	@Watch("start")
	@Watch("end")
	updateValue() {
		this.value = this.start && this.end ? { start: this.start, end: this.end } : undefined
	}
	@Watch("value")
	valueChanged() {
		this.changed = this.initialStart != this.start || this.initialEnd != this.end
		this.listener.changed?.(this)
	}
	@Listen("smoothlyInputLoad")
	SmoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputDateRange) => void>): void {
		if (!(event.target && "name" in event.target && event.target.name === this.name)) {
			event.stopPropagation()
			event.detail(this)
		}
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks: Looks) => void>) {
		if (event.target != this.element)
			event.stopPropagation()
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>) {
		this.listener[property] = listener
		listener(this)
	}
	@Method()
	async edit(editable: boolean) {
		this.readonly = !editable
	}
	@Method()
	async reset() {
		this.start = this.initialStart
		this.end = this.initialEnd
	}
	@Method()
	async setInitialValue() {
		this.initialStart = this.start
		this.initialEnd = this.end
		this.changed = false
	}
	@Method()
	async clear(): Promise<void> {
		this.start = undefined
		this.end = undefined
		this.smoothlyInput.emit({ [this.name]: undefined })
	}
	render() {
		return (
			<Host tabindex={0}>
				<section onClick={() => !this.readonly && (this.open = !this.open)}>
					<smoothly-input
						type="text" // TODO: date-range tidily thing
						name="dateRangeInput"
						readonly={this.readonly}
						value={this.start && this.end ? `${this.start} — ${this.end}` : undefined}
						placeholder={this.placeholder}
						showLabel={this.showLabel}
						onSmoothlyInput={e => {
							e.stopPropagation()
							this.inputHandler(e.detail)
						}}>
						<slot></slot>
					</smoothly-input>
				</section>
				<span class={"icons"}>
					<slot name={"end"}></slot>
				</span>
				{this.open && <div onClick={() => (this.open = false)} />}
				{this.open && (
					<nav>
						<div class="arrow" />
						<smoothly-calendar
							doubleInput={true}
							onSmoothlyValueChange={e => e.stopPropagation()}
							onSmoothlyStartChange={e => {
								e.stopPropagation()
								this.start = e.detail
							}}
							onSmoothlyEndChange={e => {
								e.stopPropagation()
								this.end = e.detail
							}}
							onSmoothlyDateSet={e => e.stopPropagation()}
							onSmoothlyDateRangeSet={e => {
								e.stopPropagation()
								this.open = false
								this.smoothlyInput.emit({ [this.name]: e.detail })
							}}
							value={this.start}
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
