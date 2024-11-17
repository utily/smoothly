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
import { tidily } from "tidily"
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
export class SmoothlyInputNext implements ComponentWillLoad, Input, Editable, Clearable {
	@Element() element: HTMLSmoothlyInputNextElement
	parent: Editable | undefined
	private action: Action
	private inputElement: HTMLInputElement | undefined
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	@Prop({ mutable: true }) name: string
	@Prop({ reflect: true, mutable: true }) looks: Looks
	@Prop({ reflect: true }) type: tidily.Type = "text"
	@Prop() currency?: isoly.Currency
	@Prop({ mutable: true }) value: any
	@Prop({ mutable: true }) changed = false
	@Prop() disabled = false
	@Prop({ mutable: true, reflect: true }) readonly = false
	@State() initialValue?: any
	@State() state: Readonly<tidily.State> & Readonly<tidily.Settings>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>

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
				this.action = Action.create("price", this.currency)
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
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
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
					placeholder={this.type}
					autocomplete={this.state.autocomplete ?? "off"}
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
