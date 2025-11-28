import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { Clearable } from "../../Clearable"
import { Editable } from "../../Editable"
import { Input } from "../../Input"
import { Looks } from "../../Looks"
import { Color } from "./../../../../model"

@Component({
	tag: "smoothly-input-date-range",
	styleUrl: "style.scss",
	scoped: true,
})
export class SmoothlyInputDateRange implements Clearable, Input, Editable {
	private startTextElement?: HTMLSmoothlyDateTextElement
	private endTextElement?: HTMLSmoothlyDateTextElement
	private calendarElement?: HTMLSmoothlyCalendarElement
	@Element() element: HTMLElement
	@Prop({ reflect: true }) locale?: isoly.Locale
	@Prop({ reflect: true }) name: string = "dateRange"
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ reflect: true }) disabled?: boolean
	@Prop({ reflect: true }) showLabel = true
	@Prop({ mutable: true }) start: isoly.Date | undefined
	@Prop({ mutable: true }) end: isoly.Date | undefined
	@Prop({ reflect: true }) placeholder: string
	@Prop({ reflect: true }) alwaysShowGuide = false
	@Prop() invalid?: boolean = false
	@Prop() max?: isoly.Date
	@Prop() min?: isoly.Date
	parent: Editable | undefined
	isDifferentFromInitial = false
	private hasFocus = false
	private observer = Editable.Observer.create(this)
	private initialStart?: isoly.Date
	private initialEnd?: isoly.Date
	@State() open: boolean
	@State() startHasText = false
	@State() endHasText = false
	@Event() smoothlyInput: EventEmitter<{ [name: string]: Partial<isoly.DateRange> | undefined }>
	@Event() smoothlyUserInput: EventEmitter<Input.UserInput<Partial<isoly.DateRange> | undefined>>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>

	async componentWillLoad() {
		this.setInitialValue()
		this.smoothlyInputLooks.emit(
			(looks, color) => ((this.looks = this.looks ?? looks), !this.color && (this.color = color))
		)
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
		this.smoothlyInput.emit({ [this.name]: await this.getValue() })
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.observer.publish()
	}
	@Watch("start")
	startChanged(_: isoly.Date | undefined, oldValue: isoly.Date | undefined) {
		this.updateValue(oldValue, this.end)
	}
	@Watch("end")
	endChanged(_: isoly.Date | undefined, oldValue: isoly.Date | undefined) {
		this.updateValue(this.start, oldValue)
	}

	async updateValue(oldStart: isoly.Date | undefined, oldEnd: isoly.Date | undefined) {
		if (oldStart != this.start || oldEnd != this.end) {
			this.isDifferentFromInitial = this.initialStart != this.start || this.initialEnd != this.end
			this.smoothlyInput.emit({ [this.name]: await this.getValue() })
			this.observer.publish()
		}
		if (!this.hasFocus) {
			this.startTextElement?.setValue(this.start)
			this.endTextElement?.setValue(this.end)
		}
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
	onClick(event: MouseEvent): void {
		const includesStartTextElement = !!this.startTextElement && event.composedPath().includes(this.startTextElement)
		const includesEndTextElement = !!this.endTextElement && event.composedPath().includes(this.endTextElement)
		const includesTextElement = includesStartTextElement || includesEndTextElement
		if (!includesTextElement && !this.readonly && !this.disabled)
			this.start && !this.end ? this.endTextElement?.select() : this.startTextElement?.select()
		if (!this.readonly && !this.disabled)
			this.open = !this.open || includesTextElement
	}
	async onSmoothlyDateTextChange(event: CustomEvent<isoly.Date | undefined>, startOrEnd: "start" | "end") {
		event.stopPropagation()
		const newValue = event.detail ?? undefined
		const start = startOrEnd == "start" ? newValue : this.start
		const end = startOrEnd == "end" ? newValue : this.end
		if (isoly.Date.is(start) && isoly.Date.is(end) && start > end) {
			// Swap values
			this.start = end
			this.end = start
			this.startTextElement?.setValue(this.start)
			this.endTextElement?.setValue(this.end)
			this.smoothlyUserInput.emit({ name: this.name, value: await this.getValue() })
		} else if (this[startOrEnd] != newValue) {
			this[startOrEnd] = newValue
			this.smoothlyUserInput.emit({ name: this.name, value: await this.getValue() })
		}
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
	async getValue(): Promise<Partial<isoly.DateRange | undefined>> {
		return this.start || this.end ? { start: this.start, end: this.end } : undefined
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
	}
	@Method()
	async setInitialValue() {
		this.initialStart = this.start
		this.initialEnd = this.end
		this.isDifferentFromInitial = false
	}
	@Method()
	async clear(): Promise<void> {
		this.start = undefined
		this.end = undefined
		this.smoothlyInput.emit({ [this.name]: undefined })
	}
	render() {
		return (
			<Host
				tabindex={this.disabled ? undefined : 0}
				class={{
					"has-value": !!(this.start || this.end),
					"has-text": !!(this.startHasText || this.endHasText),
					"floating-label": this.alwaysShowGuide,
				}}>
				<span class="smoothly-date-range-input-part" onClick={(e: MouseEvent) => this.onClick(e)}>
					<slot name="start" />
					<label class={"label float-on-focus"}>
						<slot />
					</label>
					{this.placeholder && <span class="smoothly-date-range-placeholder">{this.placeholder}</span>}
					<smoothly-date-text
						ref={el => (this.startTextElement = el)}
						class="start-date-text"
						locale={this.locale}
						onSmoothlyDateTextHasText={e => (e.stopPropagation(), (this.startHasText = e.detail))}
						onSmoothlyDateTextFocusChange={e => (e.stopPropagation(), (this.hasFocus = e.detail))}
						onSmoothlyDateHasPartialDate={e => (e.stopPropagation(), this.calendarElement?.jumpTo(e.detail))}
						onSmoothlyDateTextChange={e => (e.stopPropagation(), this.onSmoothlyDateTextChange(e, "start"))}
						onSmoothlyDateTextNext={e => (e.stopPropagation(), this.endTextElement?.select())}
						onSmoothlyDateTextDone={e => (
							e.stopPropagation(),
							this.end ? (this.startTextElement?.deselect(), (this.open = false)) : this.endTextElement?.select()
						)}
						value={this.start}
						readonly={this.readonly}
						disabled={this.disabled}
						invalid={this.invalid}
						showLabel={this.showLabel}
					/>
					<span class="smoothly-date-range-separator"> – </span>
					<smoothly-date-text
						ref={el => (this.endTextElement = el)}
						class="end-date-text"
						locale={this.locale}
						onSmoothlyDateTextHasText={e => (e.stopPropagation(), (this.endHasText = e.detail))}
						onSmoothlyDateTextFocusChange={e => (e.stopPropagation(), (this.hasFocus = e.detail))}
						onSmoothlyDateHasPartialDate={e => (e.stopPropagation(), this.calendarElement?.jumpTo(e.detail))}
						onSmoothlyDateTextChange={e => (e.stopPropagation(), this.onSmoothlyDateTextChange(e, "end"))}
						onSmoothlyDateTextPrevious={e => (e.stopPropagation(), this.startTextElement?.select("end"))}
						onSmoothlyDateTextNext={e => e.stopPropagation()}
						onSmoothlyDateTextDone={e => (e.stopPropagation(), this.endTextElement?.deselect(), (this.open = false))}
						value={this.end}
						readonly={this.readonly}
						disabled={this.disabled}
						invalid={this.invalid}
						showLabel={this.showLabel}
					/>
				</span>
				<span class={"icons"}>
					<slot name={"end"} />
				</span>
				{this.open && (
					<smoothly-calendar
						ref={el => (this.calendarElement = el)}
						doubleInput
						onSmoothlyDateSet={e => e.stopPropagation()}
						onSmoothlyDateRangeSet={e => {
							e.stopPropagation()
							this.open = false
							this.start = e.detail.start
							this.end = e.detail.end
							this.smoothlyInput.emit({ [this.name]: e.detail })
							this.smoothlyUserInput.emit({ name: this.name, value: e.detail })
						}}
						value={this.start}
						start={this.start}
						end={this.end}
						max={this.max}
						min={this.min}
					/>
				)}
			</Host>
		)
	}
}
