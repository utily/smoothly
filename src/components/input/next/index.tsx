import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { tidily } from "tidily"
import { Color } from "../../../model"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"
import { Input } from "../Input"
import { Looks } from "../Looks"
import { Action } from "./Action"
import { getLocale } from "./getLocale"

@Component({
	tag: "smoothly-input-next",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputNext implements Clearable, Input, Editable {
	@Element() element: HTMLSmoothlyInputNextElement
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ mutable: true }) name: string
	@Prop({ mutable: true }) value: any
	@Prop({ reflect: true }) type: tidily.Type = "text"
	@Prop({ reflect: true }) required = false
	@Prop({ reflect: true }) showLabel = true
	@Prop() autocomplete = true
	@Prop({ reflect: true }) placeholder: string | undefined
	@Prop() disabled = false
	@Prop({ mutable: true, reflect: true }) readonly = false
	@Prop() toInteger?: boolean
	@Prop({ reflect: true }) currency?: isoly.Currency
	@Prop({ reflect: true }) invalid?: boolean = false
	@Prop({ mutable: true }) changed = false
	@Prop() errorMessage?: string
	@State() initialValue?: any
	@State() state: Readonly<tidily.State> & Readonly<tidily.Settings>
	parent: Editable | undefined
	private inputElement: HTMLInputElement | undefined
	private action: Action
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>

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
	async getValue(): Promise<any> {
		return this.action.getValue(this.state)
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
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Method()
	async reset(): Promise<void> {
		this.value = this.initialValue
	}
	@Method()
	async setInitialValue(): Promise<void> {
		this.changed = false
		this.initialValue = this.value
		this.smoothlyInput.emit({ [this.name]: await this.getValue() })
	}

	@Watch("currency")
	@Watch("type")
	typeChange(): void {
		switch (this.type) {
			case "price":
				this.action = Action.create("price", { currency: this.currency, toInteger: this.toInteger })
				break
			default:
				this.action = Action.create(this.type, getLocale())
				break
		}
	}
	componentWillLoad() {
		this.typeChange()
		this.initialValue = this.value
		this.state = this.action.initialState(this.value)
		this.smoothlyInputLooks.emit(
			(looks, color) => ((this.looks = this.looks ?? looks), !this.color && (this.color = color))
		)
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.listener.changed?.(this)
	}
	componentDidLoad() {
		if (this.inputElement)
			this.state = this.action.setValue(this.inputElement, this.state, this.value)
	}
	@Listen("input")
	@Listen("beforeinput")
	onEvent(event: InputEvent) {
		this.state = this.action.onInputEvent(event, this.state)
	}

	@Watch("state")
	stateChange() {
		this.smoothlyInput.emit({ [this.name]: this.action.getValue(this.state) })
	}
	@Watch("value")
	valueChange(value: any) {
		const lastValue = this.action.getValue(this.state)
		if (lastValue != value && this.inputElement) {
			this.state = this.action.setValue(this.inputElement, this.state, value)
			this.smoothlyInput.emit({ [this.name]: this.action.getValue(this.state) })
		}
	}

	render() {
		return (
			<Host>
				<input
					ref={el => (this.inputElement = el ?? this.inputElement)}
					name={this.name}
					type={this.state.type}
					inputMode={this.state.inputmode}
					placeholder={this.type /* this.placeholder */}
					required={this.required}
					autocomplete={this.autocomplete ? this.state?.autocomplete : "off"}
					disabled={this.disabled}
					readOnly={this.readonly}
					pattern={this.state.pattern?.source}
					onKeyDown={event => (this.state = this.action.onKeyDown(event, this.state))}
					onFocus={event => (this.state = this.action.onFocus(event, this.state))}
					onBlur={event => (this.state = this.action.onBlur(event, this.state))}
				/>
				<pre style={{ margin: "0" }}>
					{this.state.value}
					<span class="remainder">{this.state.remainder}</span>
				</pre>
			</Host>
		)
	}
}
