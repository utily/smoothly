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
	@Element() element: HTMLElement
	@Prop({ reflect: true }) name: string = "dateRange"
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ reflect: true }) disabled?: boolean
	@Prop({ reflect: true }) showLabel = true
	@Prop({ mutable: true }) start: isoly.Date | undefined
	@Prop({ mutable: true }) end: isoly.Date | undefined
	@Prop() placeholder: string
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
	@Event() smoothlyUserInput: EventEmitter<Input.UserInput>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>

	componentWillLoad() {
		this.setInitialValue()
		this.updateValue()
		this.smoothlyInputLooks.emit(
			(looks, color) => ((this.looks = this.looks ?? looks), !this.color && (this.color = color))
		)
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
		this.start && this.end && this.smoothlyInput.emit({ [this.name]: { start: this.start, end: this.end } })
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.observer.publish()
	}
	// TODO: disable search fields in month selectors so that the input becomes typeable and then fix input handler
	// I don't understand the comment above

	@Watch("start")
	@Watch("end")
	updateValue() {
		this.value = this.start && this.end ? { start: this.start, end: this.end } : undefined
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
			<Host tabindex={this.disabled ? undefined : 0} class={{ "has-value": !!this.value }}>
				<section onClick={() => !this.readonly && !this.disabled && (this.open = !this.open)}>
					<smoothly-date-text
						ref={el => (this.startTextElement = el)}
						value={this.start}
						onSmoothlyDateChange={e => {
							e.stopPropagation()
							if (this.start != e.detail)
								this.start = e.detail
						}}
						onSmoothlyDateTextNext={() => this.endTextElement?.select()}
						onSmoothlyDateTextDone={() => this.endTextElement?.select()}
						readonly={this.readonly}
						disabled={this.disabled}
						invalid={this.invalid}
						placeholder={this.placeholder}
						showLabel={this.showLabel}>
						<slot />
					</smoothly-date-text>
					<span class="smoothly-date-range-separator"> — </span>
					<smoothly-date-text
						ref={el => (this.endTextElement = el)}
						value={this.end}
						onSmoothlyDateChange={e => {
							e.stopPropagation()
							if (this.end != e.detail)
								this.end = e.detail
						}}
						onSmoothlyDateTextPrevious={() => this.startTextElement?.select()}
						onSmoothlyDateTextDone={() => this.startTextElement?.deselect()}
						readonly={this.readonly}
						disabled={this.disabled}
						invalid={this.invalid}
						placeholder={this.placeholder}
						showLabel={this.showLabel}
					/>
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
								this.smoothlyUserInput.emit({ name: this.name, value: e.detail })
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
