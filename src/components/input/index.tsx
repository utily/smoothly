import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { tidily } from "tidily"
import { Color } from "../../model"
import { getLocale } from "../../model/getLocale"
import { Clearable } from "./Clearable"
import { Deep } from "./Deep"
import { Editable } from "./Editable"
import { Input } from "./Input"
import { InputStateHandler } from "./InputStateHandler"
import { Key } from "./Key"
import { Looks } from "./Looks"

@Component({
	tag: "smoothly-input",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInput implements Clearable, Input, Editable {
	@Element() element: HTMLSmoothlyInputElement
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) value: any
	@Prop({ reflect: true }) type: tidily.Type = "text"
	@Prop({ reflect: true }) required = false
	@Prop({ reflect: true }) showLabel = true
	@Prop() autocomplete?: Exclude<tidily.Settings["autocomplete"], undefined>
	@Prop({ reflect: true }) placeholder: string | undefined
	@Prop() disabled = false
	@Prop({ mutable: true, reflect: true }) readonly = false
	@Prop() toInteger?: boolean
	@Prop({ reflect: true }) currency?: isoly.Currency
	@Prop() min?: number
	@Prop() max?: number
	@Prop() pad?: number
	@Prop({ reflect: true }) invalid?: boolean = false
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true }) errorMessage?: string
	@State() initialValue?: any
	@State() state: Readonly<tidily.State> & Readonly<tidily.Settings>
	parent: Editable | undefined
	private stateHandler: InputStateHandler
	private inputElement: HTMLInputElement | undefined
	private uneditable = this.readonly
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	@Event() smoothlyKeydown: EventEmitter<Key>
	@Event() smoothlyBlur: EventEmitter<void>
	@Event() smoothlyChange: EventEmitter<Record<string, any>>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>

	@Method()
	async getValue(): Promise<any | undefined> {
		return this.stateHandler.getValue(this.state)
	}
	@Method()
	async setValue(value: any): Promise<void> {
		if (this.inputElement)
			this.state = this.stateHandler.setValue(this.inputElement, this.state, value)
	}
	@Method()
	async setFocus(): Promise<void> {
		this.inputElement?.focus()
	}
	@Method()
	async setSelection(start: number, end: number): Promise<void> {
		if (this.inputElement)
			this.state = this.stateHandler.setSelection(
				this.inputElement,
				this.state,
				start,
				end < 0 ? this.inputElement.value.length + end + 1 : end
			)
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>): Promise<void> {
		this.listener[property] = listener
		listener(this)
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
	async clear(): Promise<void> {
		if (!this.uneditable && this.inputElement) {
			this.state = this.stateHandler.setValue(this.inputElement, this.state, undefined)
		}
	}
	@Method()
	async edit(editable: boolean): Promise<void> {
		!this.uneditable && (this.readonly = !editable)
	}
	@Method()
	async reset(): Promise<void> {
		if (!this.uneditable && this.inputElement) {
			this.state = this.stateHandler.setValue(this.inputElement, this.state, this.initialValue)
		}
	}
	@Method()
	async setInitialValue(): Promise<void> {
		this.changed = false
		this.initialValue = this.value
		this.smoothlyInput.emit({ [this.name]: await this.getValue() })
	}
	@Method()
	async setCustomInitialValue(value: any): Promise<void> {
		this.initialValue = value
	}
	@Listen("smoothlyInputLoad")
	async smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInput) => void>): Promise<void> {
		Input.registerSubAction(this, event)
	}
	@Watch("currency")
	@Watch("type")
	typeChange(): void {
		switch (this.type) {
			case "price":
				this.stateHandler = InputStateHandler.create("price", { currency: this.currency, toInteger: this.toInteger })
				break
			case "integer":
				this.stateHandler = InputStateHandler.create("integer", { min: this.min, max: this.max, pad: this.pad })
				break
			default:
				this.stateHandler = InputStateHandler.create(this.type, getLocale())
				break
		}
		this.state = this.stateHandler.initialState(this.value ?? this.state?.value)
	}
	@Watch("state")
	stateChange() {
		this.smoothlyInput.emit({ [this.name]: this.stateHandler.getValue(this.state) })
		this.listener.changed?.(this)
	}
	@Watch("value")
	valueChange(value: any) {
		const lastValue = this.stateHandler.getValue(this.state)
		if (Deep.notEqual(lastValue, value) && this.inputElement) {
			this.state = this.stateHandler.setValue(this.inputElement, this.state, value)
			this.smoothlyInput.emit({ [this.name]: this.stateHandler.getValue(this.state) })
		}
	}
	@Watch("readonly")
	readonlyChange() {
		this.listener.changed?.(this)
	}
	componentWillLoad() {
		this.typeChange()
		this.initialValue = this.value
		this.smoothlyInputLooks.emit(
			(looks, color) => ((this.looks = this.looks ?? looks), !this.color && (this.color = color))
		)
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.listener.changed?.(this)
	}
	componentDidLoad() {
		if (this.inputElement)
			this.inputElement.value = this.state.value
	}
	async disconnectedCallback() {
		if (!this.element.isConnected)
			await this.unregister()
	}
	@Listen("input")
	@Listen("beforeinput")
	onEvent(event: InputEvent) {
		this.state = this.stateHandler.onInputEvent(event, this.state)
	}

	render() {
		return (
			<Host
				class={{ "has-value": this.state?.value != undefined && this.state?.value != "" }}
				onclick={() => this.inputElement?.focus()}>
				<slot name="start" />
				<div class="smoothly-input-container">
					<div class={"ghost"}>
						<div class={"value"}>{this.state?.value}</div>
						<div class={"remainder"}>{this.state?.remainder}</div>
					</div>
					<input
						ref={(el: HTMLInputElement) => (this.inputElement = el)}
						color={this.color}
						name={this.name}
						type={this.state?.type}
						inputmode={this.state?.inputmode}
						placeholder={this.placeholder}
						required={this.required}
						autocomplete={this.autocomplete ?? this.state?.autocomplete}
						disabled={this.disabled}
						readOnly={this.readonly}
						pattern={this.state?.pattern && this.state?.pattern.source}
						onKeyDown={event => {
							this.state = this.stateHandler.onKeyDown(event, this.state)
							if (!this.readonly && !this.disabled)
								this.smoothlyKeydown.emit(Key.create(this.name, event))
						}}
						onFocus={event => !this.readonly && (this.state = this.stateHandler.onFocus(event, this.state))}
						onBlur={event => {
							if (!this.readonly) {
								const lastValue = this.stateHandler.getValue(this.state)
								this.state = this.stateHandler.onBlur(event, this.state)
								this.smoothlyBlur.emit()
								this.smoothlyInput.emit({ [this.name]: this.stateHandler.getValue(this.state) })
								if (Deep.notEqual(lastValue, this.stateHandler.getValue(this.state)))
									this.smoothlyChange.emit({ [this.name]: this.stateHandler.getValue(this.state) })
							}
						}}
					/>
					<label class={"label float-on-focus"} htmlFor={this.name}>
						<slot />
					</label>
				</div>
				<smoothly-icon
					class="smoothly-invalid"
					name="alert-circle"
					color="danger"
					fill="clear"
					size="small"
					toolTip={this.errorMessage}
				/>
				<slot name="end" />
			</Host>
		)
	}
}
