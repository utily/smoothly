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
import { Color } from "../../../model"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"
import { Input } from "../Input"
import { Looks } from "../Looks"

@Component({
	tag: "smoothly-input-date",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDate implements ComponentWillLoad, Clearable, Input, Editable {
	private dateTextElement?: HTMLSmoothlyDateTextElement
	private iconsElement?: HTMLElement
	private calendarElement?: HTMLSmoothlyCalendarElement
	@Element() element: HTMLElement
	@Prop({ reflect: true }) locale?: isoly.Locale
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true }) name: string
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ reflect: true }) disabled?: boolean
	@Prop() invalid?: boolean = false
	@Prop({ reflect: true }) errorMessage?: string
	@Prop({ reflect: true }) placeholder?: string
	@Prop({ reflect: true }) alwaysShowGuide = false
	parent: Editable | undefined
	changed = false
	isDifferentFromInitial = false
	private hasFocus = false
	private initialValue?: isoly.Date
	private observer = Editable.Observer.create(this)
	@Prop({ mutable: true }) value?: isoly.Date
	@Prop({ mutable: true }) open: boolean
	@Prop({ mutable: true }) max: isoly.Date
	@Prop({ mutable: true }) min: isoly.Date
	@Prop({ reflect: true }) showLabel = true
	@State() hasText = false
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyValueChange: EventEmitter<isoly.Date>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyUserInput: EventEmitter<Input.UserInput>
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>

	componentWillLoad(): void {
		this.setInitialValue()
		this.smoothlyInputLooks.emit(
			(looks, color) => ((this.looks = this.looks ?? looks), !this.color && (this.color = color))
		)
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.observer.publish()
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
	async getValue(): Promise<isoly.Date | undefined> {
		return this.value
	}
	@Method()
	async listen(listener: Editable.Observer.Listener): Promise<void> {
		this.observer.subscribe(listener)
	}
	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Watch("value")
	onValueChange(value: isoly.Date) {
		if (!this.hasFocus) {
			this.dateTextElement?.setValue(value)
		}
		this.isDifferentFromInitial = this.initialValue != this.value
		this.smoothlyValueChange.emit(value)
		this.smoothlyInput.emit({ [this.name]: value })
		this.observer.publish()
	}
	@Watch("disabled")
	@Watch("readonly")
	watchingReadonly(): void {
		this.observer.publish()
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
	smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputDate) => void>): void {
		Input.registerSubAction(this, event)
	}
	@Listen("click", { target: "window" })
	onWindowClick(event: Event): void {
		!event.composedPath().includes(this.element) && this.open && (this.open = !this.open)
	}
	onClick(event: MouseEvent): void {
		const includesTextElement = !!this.dateTextElement && event.composedPath().includes(this.dateTextElement)
		const includesCalendar = !!this.calendarElement && event.composedPath().includes(this.calendarElement)
		const includesIconsElement = !!this.iconsElement && event.composedPath().includes(this.iconsElement)
		if (!this.readonly && !this.disabled && !includesTextElement && !includesCalendar && !includesIconsElement)
			this.dateTextElement?.select()
		if (!this.readonly && !this.disabled && !includesCalendar && !includesIconsElement)
			this.open = !this.open || includesTextElement
	}
	onUserChangedValue(event: CustomEvent<isoly.Date | undefined>) {
		event.stopPropagation()
		const newValue = event.detail ?? undefined // normalize null to undefined
		if (this.value != newValue) {
			this.value = newValue
			this.smoothlyUserInput.emit({ name: this.name, value: this.value })
		}
	}
	@Method()
	async edit(editable: boolean) {
		this.readonly = !editable
	}
	@Method()
	async reset() {
		this.value = this.initialValue
	}
	@Method()
	async setInitialValue() {
		this.initialValue = this.value
		this.isDifferentFromInitial = false
	}
	@Listen("smoothlyDateSet")
	dateSetHandler(event: CustomEvent<isoly.Date>) {
		this.open = false
		event.stopPropagation()
	}
	render() {
		return (
			<Host
				tabindex={this.disabled ? undefined : 0}
				class={{ "has-value": !!this.value, "has-text": this.hasText, "floating-label": this.alwaysShowGuide }}
				onClick={(e: MouseEvent) => this.onClick(e)}>
				<slot name="start" />
				<label class={"label float-on-focus"}>
					<slot />
				</label>
				{this.placeholder && <span class="smoothly-date-placeholder">{this.placeholder}</span>}
				<smoothly-date-text
					ref={el => (this.dateTextElement = el)}
					locale={this.locale}
					readonly={this.readonly}
					disabled={this.disabled}
					showLabel={this.showLabel}
					value={this.value}
					onSmoothlyDateTextHasText={e => (e.stopPropagation(), (this.hasText = e.detail))}
					onSmoothlyDateTextFocusChange={e => (e.stopPropagation(), (this.hasFocus = e.detail))}
					onSmoothlyDateHasPartialDate={e => (e.stopPropagation(), this.calendarElement?.jumpTo(e.detail))}
					onSmoothlyDateTextChange={e => (e.stopPropagation(), this.onUserChangedValue(e))}
					onSmoothlyDateTextDone={e => (e.stopPropagation(), (this.open = false), this.dateTextElement?.deselect())}
				/>
				<span class="icons" ref={el => (this.iconsElement = el)}>
					<slot name={"end"} />
				</span>
				{this.open && !this.readonly && (
					<smoothly-calendar
						ref={el => (this.calendarElement = el)}
						doubleInput={false}
						value={this.value}
						onSmoothlyDateSet={e => (e.stopPropagation(), this.onUserChangedValue(e))}
						max={this.max}
						min={this.min}>
						<div slot={"year-label"}>
							<slot name={"year-label"} />
						</div>
						<div slot={"month-label"}>
							<slot name={"month-label"} />
						</div>
					</smoothly-calendar>
				)}
			</Host>
		)
	}
}
