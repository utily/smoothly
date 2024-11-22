import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { tidily } from "tidily"
import { Color } from "../../model"
import { getLocale } from "../../model/getLocale"
import { Action } from "./Action"
import { Clearable } from "./Clearable"
import { Editable } from "./Editable"
import { Input } from "./Input"
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
	@Prop({ reflect: true }) invalid?: boolean = false
	@Prop({ mutable: true }) changed = false
	@Prop() errorMessage?: string
	@State() action: Action
	@State() initialValue?: any
	@State() state: Readonly<tidily.State> & Readonly<tidily.Settings>
	parent: Editable | undefined
	private inputElement: HTMLInputElement | undefined
	private uneditable = this.readonly
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	@Event() smoothlyBlur: EventEmitter<void>
	@Event() smoothlyChange: EventEmitter<Record<string, any>>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>

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
	async register() {
		Input.formAdd(this)
	}
	@Method()
	async unregister() {
		Input.formRemove(this)
	}
	@Method()
	async clear(): Promise<void> {
		!this.uneditable && (this.value = undefined)
	}
	@Method()
	async edit(editable: boolean): Promise<void> {
		!this.uneditable && (this.readonly = !editable)
	}
	@Method()
	async reset(): Promise<void> {
		!this.uneditable && (this.value = this.initialValue)
	}
	@Method()
	async setInitialValue(): Promise<void> {
		this.changed = false
		this.initialValue = this.value
		this.smoothlyInput.emit({ [this.name]: await this.getValue() })
	}
	@Listen("smoothlyInputLoad")
	async smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInput) => void>): Promise<void> {
		if (!(event.target && "name" in event.target && event.target.name == this.name)) {
			event.stopPropagation()
			event.detail(this)
		}
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
		this.state = this.action.initialState(this.value)
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
			this.state = this.action.setValue(this.inputElement, this.state, this.value)
	}
	async disconnectedCallback() {
		if (!this.element.isConnected)
			await this.unregister()
	}
	@Listen("input")
	@Listen("beforeinput")
	onEvent(event: InputEvent) {
		this.state = this.action.onInputEvent(event, this.state)
	}

	render() {
		return (
			<Host
				class={{ "has-value": this.state?.value != undefined && this.state?.value != "" }}
				onclick={() => this.inputElement?.focus()}>
				<slot name="start" />
				<div>
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
						onKeyDown={event => (this.state = this.action.onKeyDown(event, this.state))}
						onFocus={event => (this.state = this.action.onFocus(event, this.state))}
						onBlur={event => (this.state = this.action.onBlur(event, this.state))}
					/>
					<label class={"label float-on-focus"} htmlFor={this.name}>
						<slot />
					</label>
					<smoothly-icon name="alert-circle" color="danger" fill="clear" size="small" toolTip={this.errorMessage} />
				</div>
				<slot name="end" />
			</Host>
		)
	}
}
