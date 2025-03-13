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
	@Prop() invalid?: boolean = false
	parent: Editable | undefined
	private initialValue?: isoly.Date
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	@Prop({ mutable: true }) value?: isoly.Date
	@Prop({ mutable: true }) open: boolean
	@Prop({ mutable: true }) max: isoly.Date
	@Prop({ mutable: true }) min: isoly.Date
	@Prop({ reflect: true }) showLabel = true
	@State() date?: isoly.Date
	@State() hour?: number
	@State() minute?: number
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyValueChange: EventEmitter<isoly.Date>
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
		const value =
			this.date && typeof this.hour == "number" && typeof this.minute == "number"
				? `${this.date}T${`${this.hour}`.padStart(2, "0")}:${`${this.minute}`.padStart(2, "0")}:00.000Z`
				: undefined
		return isoly.DateTime.is(value) ? value : undefined
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>) {
		this.listener[property] = listener
		listener(this)
	}

	@Method()
	async clear(): Promise<void> {
		this.value = undefined
		this.date = undefined
		this.hour = undefined
		this.minute = undefined
	}

	@Watch("date")
	@Watch("hour")
	@Watch("minute")
	async handleChange() {
		const value = await this.getValue()
		this.smoothlyValueChange.emit(value)
		this.smoothlyInput.emit({ [this.name]: value })
		this.listener.changed?.(this)
	}

	@Watch("value")
	valueChange(value?: isoly.DateTime) {
		if (isoly.DateTime.is(value)) {
			this.date = isoly.DateTime.getDate(value)
			this.hour = isoly.DateTime.getHour(value)
			this.minute = isoly.DateTime.getMinute(value)
		}
		this.smoothlyValueChange.emit(value)
		this.smoothlyInput.emit({ [this.name]: value })
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
	smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputDateTime) => void>): void {
		Input.registerSubAction(this, event)
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
	async reset() {
		if (isoly.DateTime.is(this.initialValue)) {
			this.date = isoly.DateTime.getDate(this.initialValue)
			this.hour = isoly.DateTime.getHour(this.initialValue)
			this.minute = isoly.DateTime.getMinute(this.initialValue)
		} else {
			this.date = undefined
			this.hour = undefined
			this.minute = undefined
		}
	}
	@Method()
	async setInitialValue() {
		this.initialValue = await this.getValue()
		this.changed = false
	}
	render() {
		return (
			<Host>
				<smoothly-input
					color={this.color}
					looks={this.looks == "transparent" ? this.looks : undefined}
					name={"date"}
					onFocus={() => !this.readonly && (this.open = !this.open)}
					onClick={() => !this.readonly && (this.open = !this.open)}
					readonly={this.readonly}
					invalid={this.invalid}
					type="date"
					value={this.date}
					showLabel={this.showLabel}
					onSmoothlyInputLoad={e => e.stopPropagation()}
					onSmoothlyInput={e => {
						e.stopPropagation()
						this.date = e.detail.date
					}}>
					<slot />
				</smoothly-input>
				<smoothly-input
					name="hour"
					type="integer"
					max={23}
					value={this.hour}
					placeholder="hh"
					onSmoothlyInputLoad={e => e.stopPropagation()}
					onSmoothlyInput={e => {
						e.stopPropagation()
						this.hour = e.detail.hour
					}}
				/>
				<span class="colon">:</span>
				<smoothly-input
					name="minute"
					type="integer"
					max={59}
					value={this.minute}
					placeholder="mm"
					onSmoothlyInputLoad={e => e.stopPropagation()}
					onSmoothlyInput={e => {
						e.stopPropagation()
						this.minute = e.detail.minute
					}}
				/>
				<span class="icons">
					<slot name={"end"} />
				</span>
				{this.open && !this.readonly && (
					<nav>
						<smoothly-calendar
							doubleInput={false}
							value={this.value}
							onSmoothlyValueChange={e => {
								this.date = e.detail
								e.stopPropagation()
							}}
							onSmoothlyDateSet={e => {
								this.open = false
								e.stopPropagation()
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
					</nav>
				)}
			</Host>
		)
	}
}
