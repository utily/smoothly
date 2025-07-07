import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { tidily } from "tidily"
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
	@Prop({ reflect: true }) name: string = "dateRange"
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ reflect: true }) disabled?: boolean
	@Prop({ reflect: true }) showLabel = true
	@Prop({ mutable: true }) start: isoly.Date | undefined
	@Prop({ mutable: true }) end: isoly.Date | undefined
	@Prop() placeholder = "from — to"
	@Prop() invalid?: boolean = false
	@Prop() max?: isoly.Date
	@Prop() min?: isoly.Date
	@Prop({ mutable: true }) changed = false
	parent: Editable | undefined
	private observer = Editable.Observer.create(this)
	private initialStart?: isoly.Date
	private initialEnd?: isoly.Date
	@State() value?: isoly.DateRange
	@State() open: boolean
	@Event() smoothlyInput: EventEmitter<{ [name: string]: isoly.DateRange | undefined }>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>

	componentWillLoad() {
		this.setInitialValue()
		this.value = this.start && this.end ? { start: this.start, end: this.end } : undefined
		this.smoothlyInputLooks.emit(
			(looks, color) => ((this.looks = this.looks ?? looks), !this.color && (this.color = color))
		)
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
		this.start && this.end && this.smoothlyInput.emit({ [this.name]: { start: this.start, end: this.end } })
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.observer.publish()
	}
	// TODO: disable search fields in month selectors so that the input becomes typeable and then fix input handler
	inputHandler(data: Data) {
		const split = "dateRangeInput" in data && typeof data.dateRangeInput == "string" && data.dateRangeInput.split(" - ")
		if (split && split.length == 2 && isoly.Date.is(split[0]) && isoly.Date.is(split[1])) {
			this.start = split[0]
			this.end = split[1]
		}
	}
	@Watch("open")
	openChanged() {
		if (!this.open) {
			if ((this.start || this.end) && !this.value) {
				this.start = undefined
				this.end = undefined
				this.value = undefined
			}
		}
	}
	@Watch("value")
	valueChanged() {
		this.changed = this.initialStart != this.start || this.initialEnd != this.end
		this.observer.publish()
	}
	@Watch("disabled")
	@Watch("readonly")
	watchingReadonly(): void {
		this.observer.publish()
	}
	@Listen("smoothlyInputLoad")
	smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputDateRange) => void>): void {
		Input.registerSubAction(this, event)
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks: Looks) => void>) {
		if (event.target != this.element)
			event.stopPropagation()
	}
	@Listen("click", { target: "window" })
	onWindowClick(event: Event): void {
		!event.composedPath().includes(this.element) && this.open && (this.open = !this.open)
	}
	async disconnectedCallback() {
		if (!this.element.isConnected)
			await this.unregister()
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
	async getValue(): Promise<isoly.DateRange | undefined> {
		return this.start && this.end ? { start: this.start, end: this.end } : undefined
	}
	@Method()
	async listen(listener: Editable.Observer.Listener): Promise<void> {
		this.observer.subscribe(listener)
	}
	@Method()
	async edit(editable: boolean) {
		this.readonly = !editable
	}
	@Method()
	async reset() {
		this.start = this.initialStart
		this.end = this.initialEnd
		this.value = this.start && this.end ? { start: this.start, end: this.end } : undefined
	}
	@Method()
	async setInitialValue() {
		this.initialStart = this.start
		this.initialEnd = this.end
		this.value = this.start && this.end ? { start: this.start, end: this.end } : undefined
		this.changed = false
	}
	@Method()
	async clear(): Promise<void> {
		this.start = undefined
		this.end = undefined
		this.value = undefined
		this.smoothlyInput.emit({ [this.name]: undefined })
	}
	render() {
		const locale = navigator.language as isoly.Locale
		const formatted =
			this.start && this.end
				? `${tidily.format(this.start, "date", locale)} — ${tidily.format(this.end, "date", locale)}`
				: undefined
		return (
			<Host tabindex={this.disabled ? undefined : 0}>
				<section onClick={() => !this.readonly && !this.disabled && (this.open = !this.open)}>
					<smoothly-input
						type="text" // TODO: date-range tidily thing
						name="dateRangeInput"
						readonly={this.readonly}
						disabled={this.disabled}
						value={this.value ? formatted : undefined}
						ghostText={!this.value ? formatted : undefined}
						invalid={this.invalid}
						placeholder={this.start || this.end ? undefined : this.placeholder}
						showLabel={this.showLabel}
						onSmoothlyInput={e => {
							e.stopPropagation()
							this.inputHandler(e.detail)
						}}>
						<slot />
					</smoothly-input>
				</section>
				<span class={"icons"}>
					<slot name={"end"} />
				</span>
				{this.open && (
					<nav>
						<smoothly-calendar
							doubleInput={true}
							onSmoothlyValueChange={e => e.stopPropagation()}
							onSmoothlyStartChange={e => {
								e.stopPropagation()
								this.start = e.detail
								this.value = undefined
								this.smoothlyInput.emit({ [this.name]: this.value })
							}}
							onSmoothlyEndChange={e => {
								e.stopPropagation()
								this.end = e.detail
							}}
							onSmoothlyDateSet={e => e.stopPropagation()}
							onSmoothlyDateRangeSet={e => {
								e.stopPropagation()
								this.value = e.detail
								this.smoothlyInput.emit({ [this.name]: e.detail })
								this.open = false
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
