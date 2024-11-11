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
import { Date } from "isoly"
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
	@Element() element: HTMLElement
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop() invalid?: boolean = false
	private initialValue?: Date
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	@Prop({ mutable: true }) value?: Date
	@Prop({ mutable: true }) open: boolean
	@Prop({ mutable: true }) max: Date
	@Prop({ mutable: true }) min: Date
	@Prop({ reflect: true }) showLabel = true
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyValueChange: EventEmitter<Date>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>

	componentWillLoad(): void {
		this.setInitialValue()
		this.smoothlyInputLooks.emit(
			(looks, color) => ((this.looks = this.looks ?? looks), !this.color && (this.color = color))
		)
		this.smoothlyInputLoad.emit(_ => {})
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.listener.changed?.(this)
	}
	@Method()
	async getValue() {
		return this.value
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>) {
		this.listener[property] = listener
		listener(this)
	}

	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Watch("value")
	onStart(next: Date) {
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
	SmoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputDate) => void>): void {
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
	async reset() {
		this.value = this.initialValue
	}
	@Method()
	async setInitialValue() {
		this.initialValue = this.value
		this.changed = false
	}
	@Listen("smoothlyDateSet")
	dateSetHandler(event: CustomEvent<Date>) {
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
					onFocus={() => !this.readonly && (this.open = !this.open)}
					onClick={() => !this.readonly && (this.open = !this.open)}
					readonly={this.readonly}
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
							value={this.value ?? Date.now()}
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
