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
	parent: Editable | undefined
	isDifferentFromInitial = false
	private hasFocus = false
	private observer = Editable.Observer.create(this)
	private initialStart?: isoly.Date
	private initialEnd?: isoly.Date
	@State() open: boolean
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
	// TODO: disable search fields in month selectors so that the input becomes typeable and then fix input handler
	// I don't understand the comment above
	@Watch("start")
	startChanged(_: isoly.Date | undefined, oldValue: isoly.Date | undefined) {
		console.trace("date-range startChanged", this.start, this.end)
		this.updateValue(oldValue, this.end)
	}
	@Watch("end")
	endChanged(_: isoly.Date | undefined, oldValue: isoly.Date | undefined) {
		console.log("date-range endChanged", this.start, this.end)
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
			<Host tabindex={this.disabled ? undefined : 0} class={{ "has-value": !!(this.start || this.end) }}>
				<span
					class="smoothly-date-range-input-part"
					onClick={(e: MouseEvent) => {
						const includesStartTextElement = this.startTextElement && e.composedPath().includes(this.startTextElement)
						const includesEndTextElement = this.endTextElement && e.composedPath().includes(this.endTextElement)
						const includesTextElement = includesStartTextElement || includesEndTextElement
						if (!includesTextElement && !this.readonly && !this.disabled) {
							this.start && !this.end ? this.endTextElement?.select() : this.startTextElement?.select()
							this.open = !this.open
						}
					}}>
					<slot name="start" />
					<label class={"label float-on-focus"}>
						<slot />
					</label>
					<smoothly-date-text
						ref={el => (this.startTextElement = el)}
						class="start-date-text"
						onSmoothlyDateTextFocusChange={e => (this.hasFocus = e.detail)}
						onSmoothlyDateTextChange={async e => {
							e.stopPropagation()
							const newValue = e.detail ?? undefined
							if (this.start != newValue) {
								this.start = newValue
								this.smoothlyUserInput.emit({ name: this.name, value: await this.getValue() })
							}
							console.log("onSmoothlyDateTextChange start", newValue, this.start, this.end)
						}}
						onSmoothlyDateTextNext={() => this.endTextElement?.select()}
						onSmoothlyDateTextDone={() => this.endTextElement?.select()}
						value={this.start}
						readonly={this.readonly}
						disabled={this.disabled}
						invalid={this.invalid}
						placeholder={this.placeholder}
						showLabel={this.showLabel}
					/>
					<span class="smoothly-date-range-separator"> — </span>
					<smoothly-date-text
						ref={el => (this.endTextElement = el)}
						class="end-date-text"
						onSmoothlyDateTextFocusChange={e => (this.hasFocus = e.detail)}
						onSmoothlyDateTextChange={async e => {
							e.stopPropagation()
							const newValue = e.detail ?? undefined
							if (this.end != newValue) {
								this.end = newValue
								this.smoothlyUserInput.emit({ name: this.name, value: await this.getValue() })
							}
							console.log("onSmoothlyDateTextChange end", newValue, this.start, this.end)
						}}
						onSmoothlyDateTextPrevious={() => this.startTextElement?.select("end")}
						onSmoothlyDateTextDone={() => this.startTextElement?.deselect()}
						value={this.end}
						readonly={this.readonly}
						disabled={this.disabled}
						invalid={this.invalid}
						placeholder={this.placeholder}
						showLabel={this.showLabel}
					/>
				</span>
				<span class={"icons"}>
					<slot name={"end"} />
				</span>
				{this.open && (
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
				)}
			</Host>
		)
	}
}
