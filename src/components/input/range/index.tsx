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
import { tidily } from "tidily"
import { Color } from "../../../model"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"
import { Input } from "../Input"
import { Looks } from "../Looks"

@Component({
	tag: "smoothly-input-range",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputRange implements Input, Clearable, Editable, ComponentWillLoad {
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	private input?: HTMLSmoothlyInputElement
	private initialValue: number | undefined = undefined
	@Element() element: HTMLSmoothlyInputRangeElement
	@Prop({ mutable: true }) value: number | undefined = undefined
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop() type: Extract<tidily.Type, "text" | "percent"> = "text"
	@Prop() min = 0
	@Prop() max = 100
	@Prop() name = "range"
	@Prop() step?: number
	@Prop() outputSide: "right" | "left" = "left"
	@Prop() label: string
	@State() showInput = false
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit((looks, color) => ((this.looks = this.looks ?? looks), (this.color = color)))
		this.smoothlyInput.emit({ [this.name]: this.value })
		this.smoothlyInputLoad.emit(() => {
			return
		})
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.value && (this.initialValue = this.value)
		this.valueChanged()
	}
	@Listen("smoothlyInputLoad")
	smoothlyInputLoadHandler(event: CustomEvent<(parent: unknown) => void>) {
		if (event.target != this.element) {
			event.stopPropagation()
			event.detail(this)
		}
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks: Looks) => void>): void {
		if (event.target != this.element)
			event.stopPropagation()
	}
	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>): Promise<void> {
		this.listener[property] = listener
		listener(this)
	}
	@Method()
	async edit(editable: boolean): Promise<void> {
		this.readonly = !editable
	}
	@Method()
	async reset(): Promise<void> {
		this.value = this.initialValue
	}
	@Method()
	async setInitialValue(): Promise<void> {
		this.initialValue = this.value
		this.valueChanged()
	}
	@Watch("value")
	valueChanged(): void {
		const decimals = !this.step ? undefined : this.step.toString().split(".")[1]?.length ?? 0
		this.value = Number.isNaN(this.value) || this.value == undefined ? undefined : +this.value.toFixed(decimals)
		this.changed = this.initialValue !== this.value
		this.listener.changed?.(this)
		this.smoothlyInput.emit({ [this.name]: this.value })
	}
	inputHandler(event: Event): void {
		event.stopPropagation()
		const value = !event ? this.value : event.target && "value" in event.target ? Number(event.target.value) : undefined
		if (value == undefined)
			this.value = undefined
		else if (value < this.min)
			this.value = this.min
		else if (value > this.max)
			this.value = this.max
		else
			this.value = value
		this.input && (this.input.value = this.type == "text" ? this.value?.toString() : this.value)
	}

	render(): VNode | VNode[] {
		return (
			<Host
				class={{
					"output-side-right": this.outputSide === "right",
					"show-label": this.outputSide === "left" && !!this.label,
				}}>
				<slot name="start" />
				<div>
					<label htmlFor={this.name}>{this.label}</label>
					<smoothly-input
						ref={e => (this.input = e)}
						looks={undefined}
						color={this.color}
						showLabel={this.outputSide === "left" && !!this.label}
						type={this.type}
						onSmoothlyInputLoad={e => (e.stopPropagation(), this.inputHandler(e))}
						onSmoothlyBlur={e => this.inputHandler(e)}
						onSmoothlyInput={e => e.stopPropagation()}
						value={this.type == "percent" ? this.value : this.value?.toString()}
						placeholder={this.outputSide === "right" ? "-" : undefined}
						readonly={this.readonly}>
						{this.label}
					</smoothly-input>
					<smoothly-display label={(this.type == "percent" ? this.min * 100 : this.min).toString()}></smoothly-display>
					<input
						name={this.name}
						part="range"
						type="range"
						min={this.min}
						max={this.max}
						step={this.step ?? "any"}
						disabled={this.readonly}
						onInput={event => this.inputHandler(event)}
						value={this.value ?? this.min}
					/>
					<smoothly-display label={(this.type == "percent" ? this.max * 100 : this.max).toString()}></smoothly-display>
				</div>
				<slot name="end" />
			</Host>
		)
	}
}
