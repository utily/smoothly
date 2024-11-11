import {
	Component,
	ComponentWillLoad,
	Element,
	Event,
	EventEmitter,
	h,
	Host,
	Listen,
	Method,
	Prop,
	VNode,
	Watch,
} from "@stencil/core"
import { isoly } from "isoly"
import { Data } from "../../../model"
import { Color } from "../../../model"
import * as generate from "../../calendar/generate"
import { Editable } from "../Editable"
import { Input } from "../Input"
import { Looks } from "../Looks"

@Component({
	tag: "smoothly-input-month",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputMonth implements ComponentWillLoad, Input, Editable {
	changed: boolean
	@Element() element: HTMLSmoothlyInputMonthElement
	@Prop({ reflect: true, mutable: true }) readonly: boolean
	@Prop({ reflect: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop() name: string
	@Prop({ mutable: true }) value?: isoly.Date = isoly.Date.now()
	@Prop({ reflect: true }) next = false
	@Prop({ reflect: true }) previous = false
	@Prop({ reflect: true }) inCalendar = false
	@Prop({ reflect: true }) showLabel = true
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	private year?: HTMLSmoothlyInputSelectElement
	private month?: HTMLSmoothlyInputSelectElement
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}

	componentWillLoad(): void {
		this.smoothlyInputLooks.emit(looks => (this.looks = this.looks ?? looks))
		this.smoothlyInputLoad.emit(() => {})
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.valueChanged()
	}
	@Watch("value")
	valueChanged(): void {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}
	private adjustMonth(delta: number): void {
		if (!this.readonly) {
			const date = isoly.Date.parse(this.value ?? isoly.Date.now())
			date.setMonth(date.getMonth() + delta)
			this.value = isoly.Date.create(date)
		}
	}
	@Method()
	async clear(): Promise<void> {
		this.year?.clear()
		this.month?.clear()
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>): Promise<void> {
		this.listener[property] = listener
		listener(this)
	}
	@Method()
	async edit(editable: boolean): Promise<void> {
		this.readonly = !editable
	}
	@Method()
	async reset(): Promise<void> {
		this.year?.reset()
		this.month?.reset()
	}
	@Method()
	async setInitialValue(): Promise<void> {
		this.year?.setInitialValue()
		this.month?.setInitialValue()
	}
	inputHandler(event: CustomEvent<Record<string, any>>): void {
		if (event.target != this.element) {
			event.stopPropagation()
			const year = event.detail[`${this.name}-year`]
			const month = event.detail[`${this.name}-month`]
			if (month && isoly.Date.is(month))
				this.value = isoly.Date.firstOfMonth(month)
			else if (year && isoly.Date.is(year))
				this.value = isoly.Date.firstOfMonth(year)
		}
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks?: Looks, color?: Color) => void>): void {
		if (event.target != this.element) {
			event.stopPropagation()
			event.detail(this.looks, this.color)
		}
	}
	@Listen("smoothlyInputLoad")
	async smoothlyInputLoadHandler(event: CustomEvent<(parent: Editable) => void>): Promise<void> {
		if (event.target != this.element)
			event.stopPropagation()
	}

	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-icon
					name={"caret-back-outline"}
					size={"tiny"}
					color={this.color}
					fill={"default"}
					class={{ disabled: this.readonly }}
					onClick={() => this.adjustMonth(-1)}
				/>
				<smoothly-input-select
					ref={e => (this.year = e)}
					name={`${this.name}-year`}
					readonly={this.readonly}
					changed={this.changed}
					menuHeight="5.5items"
					required
					inCalendar={this.inCalendar}
					showLabel={this.showLabel}
					onSmoothlyInput={e => this.inputHandler(e)}
					searchDisabled>
					<div slot={"label"}>
						<slot name={"year-label"} />
					</div>
					{generate.years(this.value ?? isoly.Date.now()).map(year => (
						<smoothly-item key={year.date} value={year.date} selected={year.selected || this.value == year.date}>
							{year.name}
						</smoothly-item>
					))}
				</smoothly-input-select>
				<smoothly-input-select
					ref={e => (this.month = e)}
					name={`${this.name}-month`}
					readonly={this.readonly}
					color={this.color}
					looks={this.looks}
					changed={this.changed}
					menuHeight="5.5items"
					required
					inCalendar={this.inCalendar}
					showLabel={this.showLabel}
					onSmoothlyInput={e => this.inputHandler(e)}
					searchDisabled>
					<div slot={"label"}>
						<slot name={"month-label"} />
					</div>
					{generate.months(this.value ?? isoly.Date.now()).map(month => (
						<smoothly-item key={month.date} value={month.date} selected={month.selected || this.value == month.date}>
							{month.name}
						</smoothly-item>
					))}
				</smoothly-input-select>
				<smoothly-icon
					name={"caret-forward-outline"}
					size={"tiny"}
					color={this.color}
					fill={"default"}
					class={{ disabled: this.readonly }}
					onClick={() => this.adjustMonth(1)}
				/>
			</Host>
		)
	}
}
