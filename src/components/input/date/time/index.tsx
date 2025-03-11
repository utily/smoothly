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
	Watch,
} from "@stencil/core"
import { isoly } from "isoly"
import { Color } from "../../../../model"
import { Clearable } from "../../Clearable"
import { Editable } from "../../Editable"
import { Input } from "../../Input"
import { Looks } from "../../Looks"

@Component({
	tag: "smoothly-input-date-time",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDateTime implements ComponentWillLoad, Clearable, Input, Editable {
	@Element() element: HTMLElement
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ reflect: true }) invalid?: boolean = false
	parent: Editable | undefined
	private initialValue?: isoly.DateTime
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	@Prop({ mutable: true }) value?: isoly.DateTime
	@Prop({ mutable: true }) open: boolean
	@Prop({ mutable: true }) max: isoly.DateTime
	@Prop({ mutable: true }) min: isoly.DateTime
	@Prop({ reflect: true }) showLabel = true
	@State() date?: isoly.Date
	@State() hour?: number
	@State() minute?: number
	@State() stringValue?: string
	@State() placeholder?: string
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyValueChange: EventEmitter<isoly.DateTime>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>

	componentWillLoad(): void {
		this.setInitialValue()
		this.smoothlyInputLooks.emit(
			(looks, color) => ((this.looks = this.looks ?? looks), !this.color && (this.color = color))
		)
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.listener.changed?.(this)
	}
	componentDidLoad() {
		// TODO remove this when tidily date-time formatter works
		this.element.querySelector("input")?.addEventListener("focus", event => {
			if (event.target instanceof HTMLInputElement)
				event.target.blur()
		})
	}
	async disconnectedCallback() {
		if (!this.element.isConnected)
			await this.unregister()
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
	async getValue(): Promise<isoly.DateTime | undefined> {
		return this.value
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>) {
		this.listener[property] = listener
		listener(this)
	}
	@Watch("date")
	@Watch("hour")
	@Watch("minute")
	dateTimeChange() {
		// let result: string | undefined
		// const partiallyDefined = !!this.date || typeof this.hour == "number" || typeof this.minute == "number"
		// const fullyDefined = !!this.date && typeof this.hour == "number" && typeof this.minute == "number"
		// if (partiallyDefined) {
		// 	result = typeof this.date == "string" ? this.date : "YYYY-MM-DD"
		// 	result += " "
		// 	result += typeof this.hour == "number" ? `${this.hour}`.padStart(2, "0") : "hh"
		// 	result += ":"
		// 	result += this.minute != undefined ? `${this.minute}`.padStart(2, "0") : "mm"
		// }
		// this.stringValue = fullyDefined ? result : undefined
		// this.placeholder = partiallyDefined ? result : undefined
		const value =
			this.date && typeof this.hour == "number" && typeof this.minute == "number"
				? `${this.date}T${`${this.hour}`.padStart(2, "0")}:${`${this.minute}`.padStart(2, "0")}`
				: undefined
		if (
			typeof value != typeof this.value ||
			(isoly.DateTime.is(value) &&
				isoly.DateTime.is(this.value) &&
				isoly.DateTime.span(value, this.value, "minutes").minutes != 0)
		)
			this.value = value
	}
	@Watch("value")
	valueChange(next?: isoly.DateTime) {
		if (isoly.DateTime.is(next)) {
			this.date = isoly.DateTime.getDate(next)
			this.hour = isoly.DateTime.getHour(next)
			this.minute = isoly.DateTime.getMinute(next)
		}
		this.smoothlyValueChange.emit(next)
		this.smoothlyInput.emit({ [this.name]: next })
		this.listener.changed?.(this)
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
	@Listen("smoothlyInputLoad")
	SmoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputDateTime) => void>): void {
		if (!(event.target && "name" in event.target && event.target.name === this.name)) {
			event.stopPropagation()
			event.detail(this)
		}
	}
	@Listen("click", { target: "window" })
	onWindowClick(event: Event): void {
		!event.composedPath().includes(this.element) && this.open && (this.open = !this.open)
	}
	@Method()
	async edit(editable: boolean) {
		this.readonly = !editable
	}
	@Method()
	async clear(): Promise<void> {
		this.date = undefined
		this.hour = undefined
		this.minute = undefined
	}
	@Method()
	async reset() {
		this.value = this.initialValue
	}
	@Method()
	async setInitialValue() {
		this.initialValue = this.value
		this.changed = false
	}
	render() {
		return (
			<Host>
				<smoothly-input
					color={this.color}
					looks={this.looks == "transparent" ? this.looks : undefined}
					name={this.name}
					onFocus={() => !this.readonly && (this.open = !this.open)}
					onClick={() => !this.readonly && (this.open = !this.open)}
					readonly={this.readonly}
					invalid={this.invalid}
					type="date"
					value={this.stringValue}
					placeholder={this.placeholder}
					showLabel={this.showLabel}
					onSmoothlyInputLoad={e => e.stopPropagation()}
					onSmoothlyInput={e => e.stopPropagation()}>
					<slot />
				</smoothly-input>
				<smoothly-input
					color={this.color}
					looks={this.looks}
					name={this.name}
					type={"duration"}
					value={this.value}
					placeholder={"hh:mm"}
					readonly
				/>
				<span class="icons">
					<slot name={"end"} />
				</span>
				{this.open && !this.readonly && (
					<nav>
						<smoothly-calendar
							doubleInput={false}
							value={this.date}
							onSmoothlyValueChange={event => {
								this.date = event.detail
								event.stopPropagation()
							}}
							onSmoothlyDateSet={event => {
								this.date = event.detail
								event.stopPropagation()
							}}
							max={this.max}
							min={this.min}>
							<div slot={"year-label"}>
								<slot name={"year-label"} />
							</div>
							<div slot={"month-label"}>
								<slot name={"month-label"} />
							</div>
						</smoothly-calendar>
						<div>
							<smoothly-input-select
								name={"hour"}
								menuHeight="6items"
								placeholder={"hh"}
								onSmoothlyInput={e => {
									e.stopPropagation()
									this.hour = e.detail.hour as number | undefined
								}}>
								<span slot={"label"}>Hour</span>
								{Array.from({ length: 24 }).map((_, i) => (
									<smoothly-item value={i} selected={this.hour == i}>
										{i}
									</smoothly-item>
								))}
							</smoothly-input-select>
							:
							<smoothly-input-select
								name={"minute"}
								menuHeight="6items"
								placeholder={"mm"}
								onSmoothlyInput={e => {
									e.stopPropagation()
									this.minute = e.detail.minute as number | undefined
								}}>
								<span slot={"label"}>Minute</span>
								{Array.from({ length: 60 }).map((_, i) => (
									<smoothly-item value={i} selected={this.minute == i}>
										{i}
									</smoothly-item>
								))}
							</smoothly-input-select>
						</div>
					</nav>
				)}
			</Host>
		)
	}
}
