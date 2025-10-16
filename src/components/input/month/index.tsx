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
	State,
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
	isDifferentFromInitial: boolean
	parent: Editable | undefined
	@Element() element: HTMLSmoothlyInputMonthElement
	@Prop({ reflect: true, mutable: true }) readonly: boolean
	@Prop({ reflect: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) value?: isoly.Date = isoly.Date.now()
	@Prop({ mutable: true }) max?: isoly.Date
	@Prop({ mutable: true }) min?: isoly.Date
	@Prop({ reflect: true }) next = false
	@Prop({ reflect: true }) previous = false
	@Prop({ reflect: true }) inCalendar = false
	@Prop({ reflect: true }) showLabel = true
	@State() allowPreviousMonth = true
	@State() allowNextMonth = true
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyUserInput: EventEmitter<Input.UserInput>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	private year?: HTMLSmoothlyInputSelectElement
	private month?: HTMLSmoothlyInputSelectElement
	private observer = Editable.Observer.create(this)

	componentWillLoad(): void {
		this.smoothlyInputLooks.emit(looks => (this.looks = this.looks ?? looks))
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
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
	async disconnectedCallback() {
		if (!this.element.isConnected)
			await this.unregister()
	}
	@Watch("value")
	@Watch("min")
	setAllowPreviousMonth() {
		const previousMonth = isoly.Date.previousMonth(this.value ?? isoly.Date.now()).substring(0, 7)
		const minMonth = this.min?.substring(0, 7)
		this.allowPreviousMonth = !minMonth || previousMonth >= minMonth
	}
	@Watch("value")
	@Watch("max")
	setAllowNextMonth() {
		const nextMonth = isoly.Date.nextMonth(this.value ?? isoly.Date.now()).substring(0, 7)
		const maxMonth = this.max?.substring(0, 7)
		this.allowNextMonth = !maxMonth || nextMonth <= maxMonth
	}
	@Watch("name")
	nameChange(_: string | undefined, oldName: string | undefined) {
		Input.formRename(this, oldName)
	}
	@Method()
	async register() {
		Input.formAdd(this)
	}
	@Method()
	async unregister() {
		Input.formRemove(this)
	}
	@Method()
	async getValue(): Promise<isoly.Date | undefined> {
		return this.value
	}
	@Method()
	async clear(): Promise<void> {
		this.year?.clear()
		this.month?.clear()
	}
	@Method()
	async listen(listener: Editable.Observer.Listener): Promise<void> {
		this.observer.subscribe(listener)
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
					class={{
						disabled: this.readonly || !this.allowPreviousMonth,
					}}
					onClick={() => this.allowPreviousMonth && this.adjustMonth(-1)}
				/>
				<smoothly-input-select
					ref={e => (this.year = e)}
					name={`${this.name}-year`}
					readonly={this.readonly}
					menuHeight="5.5items"
					required
					ordered
					inCalendar={this.inCalendar}
					showLabel={this.showLabel}
					onSmoothlyInput={e => this.inputHandler(e)}
					onSmoothlyUserInput={e => {
						const month = e.detail.value
						if (month && isoly.Date.is(month)) {
							const value = isoly.Date.firstOfMonth(month)
							this.smoothlyUserInput.emit({ name: this.name, value })
						}
					}}
					searchDisabled>
					<div slot={"label"}>
						<slot name={"year-label"} />
					</div>
					{generate.years(this.value ?? isoly.Date.now(), this.min, this.max).map(year => (
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
					menuHeight="5.5items"
					required
					ordered
					inCalendar={this.inCalendar}
					showLabel={this.showLabel}
					onSmoothlyInput={e => this.inputHandler(e)}
					onSmoothlyUserInput={e => {
						const year = e.detail.value
						if (year && isoly.Date.is(year)) {
							const value = isoly.Date.firstOfMonth(year)
							this.smoothlyUserInput.emit({ name: this.name, value })
						}
					}}
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
					class={{ disabled: this.readonly || !this.allowNextMonth }}
					onClick={() => this.allowNextMonth && this.adjustMonth(1)}
				/>
			</Host>
		)
	}
}
