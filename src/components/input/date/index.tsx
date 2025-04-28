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
	Watch,
} from "@stencil/core"
import { isoly } from "isoly"
import { Color } from "../../../model"
import { ChildListener } from "../ChildListener"
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
	@Element() element: HTMLElement
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ reflect: true }) disabled?: boolean
	@Prop() invalid?: boolean = false
	@Prop({ reflect: true }) errorMessage?: string
	parent: Editable | undefined
	private initialValue?: isoly.Date
	private childListener = ChildListener.create(this)
	@Prop({ mutable: true }) value?: isoly.Date
	@Prop({ mutable: true }) open: boolean
	@Prop({ mutable: true }) max: isoly.Date
	@Prop({ mutable: true }) min: isoly.Date
	@Prop({ reflect: true }) showLabel = true
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
		this.childListener.publish()
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
	async listen(listener: Editable.Listener): Promise<void> {
		this.childListener.subscribe(listener)
	}
	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Watch("value")
	onStart(next: isoly.Date) {
		this.smoothlyValueChange.emit(next)
		this.smoothlyInput.emit({ [this.name]: next })
		this.childListener.publish()
	}
	@Watch("disabled")
	@Watch("readonly")
	watchingReadonly(): void {
		this.childListener.publish()
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
		this.changed = false
	}
	@Listen("smoothlyDateSet")
	dateSetHandler(event: CustomEvent<isoly.Date>) {
		this.open = false
		event.stopPropagation()
	}
	render() {
		return (
			<Host>
				<smoothly-input
					color={this.color}
					looks={this.looks == "transparent" ? this.looks : undefined}
					name={this.name}
					onFocus={() => !this.readonly && !this.disabled && (this.open = !this.open)}
					onClick={() => !this.readonly && !this.disabled && (this.open = !this.open)}
					readonly={this.readonly}
					disabled={this.disabled}
					errorMessage={this.errorMessage}
					invalid={this.invalid}
					type="date"
					value={this.value}
					showLabel={this.showLabel}
					onSmoothlyInputLoad={e => e.stopPropagation()}
					onSmoothlyInput={e => {
						e.stopPropagation()
						this.value = e.detail[this.name]
					}}>
					<slot />
				</smoothly-input>
				<span class="icons">
					<slot name={"end"} />
				</span>
				{this.open && !this.readonly && (
					<nav>
						<smoothly-calendar
							doubleInput={false}
							value={this.value}
							onSmoothlyValueChange={event => {
								this.value = event.detail
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
					</nav>
				)}
			</Host>
		)
	}
}
