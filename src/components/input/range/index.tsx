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
import { Range } from "./Range"

@Component({
	tag: "smoothly-input-range",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputRange implements Input, Clearable, Editable, ComponentWillLoad {
	parent: Editable | undefined
	isDifferentFromInitial = false
	private observer = Editable.Observer.create(this)
	private input?: HTMLSmoothlyInputElement
	private startInput?: HTMLSmoothlyInputElement
	private endInput?: HTMLSmoothlyInputElement
	private initialValue: Range.Value | undefined = undefined
	@Element() element: HTMLSmoothlyInputRangeElement
	@Prop({ mutable: true }) value: Range.Value | undefined = undefined
	@Prop() dual = false
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ mutable: true }) defined = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ reflect: true }) disabled?: boolean
	@Prop() type: Extract<tidily.Type, "text" | "percent"> = "text"
	@Prop() min = 0
	@Prop() max = 100
	@Prop({ reflect: true }) name = "range"
	@Prop() step?: number
	@Prop() outputSide: "right" | "left" = "left"
	@Prop() label: string
	@State() showInput = false
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyUserInput: EventEmitter<Input.UserInput>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit((looks, color) => ((this.looks = this.looks ?? looks), (this.color = color)))
		this.smoothlyInput.emit({ [this.name]: this.value })
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.value && (this.initialValue = this.value)
		this.valueChanged()
	}
	@Listen("smoothlyInputLoad")
	smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputRange) => void>) {
		Input.registerSubAction(this, event)
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks: Looks) => void>): void {
		if (event.target != this.element) {
			event.stopPropagation()
		}
	}
	async disconnectedCallback() {
		if (!this.element.isConnected) {
			await this.unregister()
		}
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
	async getValue(): Promise<Range.Value | undefined> {
		return this.value
	}
	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Method()
	async listen(listener: Editable.Observer.Listener): Promise<void> {
		this.observer.subscribe(listener)
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
		this.isDifferentFromInitial = false
		this.valueChanged()
	}
	@Watch("value")
	valueChanged(): void {
		if (Range.is(this.value)) {
			this.value = { start: Range.round(this.value.start, this.step), end: Range.round(this.value.end, this.step) }
		} else {
			this.value = Number.isNaN(this.value) || this.value == undefined ? undefined : Range.round(this.value, this.step)
		}
		this.isDifferentFromInitial = !Range.equals(this.initialValue, this.value)
		this.defined = Range.defined(this.value)
		this.observer.publish()
		this.smoothlyInput.emit({ [this.name]: this.value })
	}
	@Watch("disabled")
	@Watch("readonly")
	watchingReadonly(): void {
		this.observer.publish()
	}
	setValue(value: number | undefined): void {
		if (value == undefined) {
			this.value = undefined
		} else if (value < this.min) {
			this.value = this.min
		} else if (value > this.max) {
			this.value = this.max
		} else {
			this.value = value
		}
		this.input && (this.input.value = this.type == "text" ? this.value?.toString() : this.value)
	}
	setRange(part: "start" | "end", value: number | undefined): void {
		if (value == undefined) {
			return
		}
		const current = Range.is(this.value) ? this.value : { start: this.min, end: this.max }
		this.value = Range.setPart(current, part, value, this.min, this.max)
		const field = part == "start" ? this.startInput : this.endInput
		const bound = Range.is(this.value) ? this.value[part] : undefined
		field && (field.value = this.type == "text" ? bound?.toString() : bound)
	}

	render(): VNode | VNode[] {
		return (
			<Host
				class={{
					"output-side-right": this.outputSide === "right",
					"show-label": this.outputSide === "left" && !!this.label,
					dual: this.dual,
				}}>
				<slot name="start" />
				<div>
					<label htmlFor={this.name}>{this.label}</label>
					{this.dual ? this.renderDual() : this.renderSingle()}
				</div>
				<slot name="end" />
			</Host>
		)
	}
	private renderSingle(): VNode[] {
		return [
			<smoothly-input
				ref={e => (this.input = e)}
				looks={undefined}
				color={this.color}
				name={this.name}
				showLabel={this.outputSide === "left" && !!this.label}
				type={this.type}
				onSmoothlyInputLoad={async e => (
					e.stopPropagation(),
					this.setValue(Input.Element.is(e.target) ? Number(await e.target.getValue()) : undefined)
				)}
				onSmoothlyBlur={e => e.stopPropagation()}
				onSmoothlyInput={async e => {
					e.stopPropagation()
					this.setValue(Input.Element.is(e.target) ? Number(await e.target.getValue()) : undefined)
				}}
				value={this.type == "percent" ? (this.value as number) : (this.value as number)?.toString()}
				placeholder={this.outputSide === "right" ? "-" : undefined}
				readonly={this.readonly}
				disabled={this.disabled}>
				{this.label}
			</smoothly-input>,
			<smoothly-display label={(this.type == "percent" ? this.min * 100 : this.min).toString()} />,
			<input
				name={this.name}
				part="range"
				type="range"
				min={this.min}
				max={this.max}
				step={this.step ?? "any"}
				disabled={this.readonly || this.disabled}
				onInput={event => {
					event.stopPropagation()
					this.setValue((event.target as HTMLInputElement).valueAsNumber)
					this.smoothlyUserInput.emit({ name: this.name, value: this.value })
				}}
				value={(this.value as number) ?? this.min}
			/>,
			<smoothly-display label={(this.type == "percent" ? this.max * 100 : this.max).toString()} />,
		]
	}
	private renderDual(): VNode[] {
		const range = Range.is(this.value) ? this.value : { start: this.min, end: this.max }
		const left = Range.percent(range.start, this.min, this.max)
		const right = 100 - Range.percent(range.end, this.min, this.max)
		return [
			this.renderField("start", range.start),
			<smoothly-display label={(this.type == "percent" ? this.min * 100 : this.min).toString()} />,
			<div class="track" part="track">
				<div class="fill" part="fill" style={{ left: `${left}%`, right: `${right}%` }} />
				{this.renderRangeInput("start", range.start)}
				{this.renderRangeInput("end", range.end)}
			</div>,
			<smoothly-display label={(this.type == "percent" ? this.max * 100 : this.max).toString()} />,
			this.renderField("end", range.end),
		]
	}
	private renderField(part: "start" | "end", value: number): VNode {
		return (
			<smoothly-input
				ref={e => (part == "start" ? (this.startInput = e) : (this.endInput = e))}
				looks={undefined}
				color={this.color}
				name={`${this.name}-${part}`}
				type={this.type}
				onSmoothlyBlur={e => e.stopPropagation()}
				onSmoothlyInput={async e => {
					e.stopPropagation()
					this.setRange(part, Input.Element.is(e.target) ? Number(await e.target.getValue()) : undefined)
					this.smoothlyUserInput.emit({ name: this.name, value: this.value })
				}}
				value={this.type == "percent" ? value : value?.toString()}
				readonly={this.readonly}
				disabled={this.disabled}
			/>
		)
	}
	private renderRangeInput(part: "start" | "end", value: number): VNode {
		return (
			<input
				part={part == "start" ? "range range-start" : "range range-end"}
				class={part}
				type="range"
				min={this.min}
				max={this.max}
				step={this.step ?? "any"}
				disabled={this.readonly || this.disabled}
				onInput={event => {
					event.stopPropagation()
					this.setRange(part, (event.target as HTMLInputElement).valueAsNumber)
					this.smoothlyUserInput.emit({ name: this.name, value: this.value })
				}}
				value={value ?? (part == "start" ? this.min : this.max)}
			/>
		)
	}
}
