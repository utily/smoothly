import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { Currency } from "isoly"
import { Direction, Settings, State as TidilyState, StateEditor } from "tidily"
import { Changeable } from "./Changeable"
import { Input, InputField } from "./Inputs"

@Component({
	tag: "smoothly-input-new",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputNew {
	private inputElement: HTMLInputElement
	/** On re-render the input will blur. This boolean is meant to keep track of if input should keep its focus. */
	private keepFocusOnReRender = false
	private lastValue: any
	@State() state: Readonly<TidilyState> & Readonly<Settings>
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) value: any
	@Prop({ reflect: true }) type = "text"
	@Prop({ mutable: true, reflect: true }) required = false
	@Prop({ mutable: true }) minLength = 0
	@Prop({ mutable: true }) maxLength: number = Number.POSITIVE_INFINITY
	@Prop({ mutable: true }) autocomplete = true
	@Prop({ mutable: true }) pattern: RegExp | undefined
	@Prop({ mutable: true, reflect: true }) placeholder: string | undefined
	@Prop({ mutable: true }) disabled = false
	@Prop({ mutable: true }) readonly = false
	@Prop({ reflect: true }) currency?: Currency
	@State() initialValue?: any

	@Event() smoothlyBlur: EventEmitter<void>
	@Event() smoothlyFocus: EventEmitter<void>
	@Event() smoothlyChange: EventEmitter<Record<string, any>>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>

	@Prop({ mutable: true, reflect: true }) changed = false
	private listener: { changed?: (parent: Changeable) => Promise<void> } = {}

	listen(property: "changed", listener: (parent: Changeable) => Promise<void>): void {
		this.listener[property] = listener
		listener(this)
	}

	@Listen("smoothlyInputLoad")
	async SmoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputNew) => void>): Promise<void> {
		event.stopPropagation()
		event.detail(this)
	}

	@Watch("value")
	valueWatcher(value: any, before: any) {
		if (this.lastValue != value) {
			this.lastValue = value
			this.state = {
				...this.state,
				value: Input.newState(
					{ value: Input.formatter(this.type, this.currency).toString(value), selection: this.state.selection },
					this.type,
					this.value
				).value,
			}
		}
		if (value != before) {
			if (typeof value == "string")
				value = value.trim()
			this.smoothlyInput.emit({ [this.name]: value })
		}

		this.changed = Boolean(this.value)
		this.listener.changed?.(this)
	}

	@Watch("currency")
	onCurrency() {
		this.state = {
			...this.state,
			value: Input.newState(
				{ value: Input.formatter(this.type, this.currency).toString(this.value), selection: this.state.selection },
				this.type,
				this.value
			).value,
			pattern: Input.newState(
				{ value: Input.formatter(this.type, this.currency).toString(this.value), selection: this.state.selection },
				this.type,
				this.value
			).pattern,
		}
	}

	componentWillLoad() {
		const value = Input.formatter(this.type, this.currency).toString(this.value) || ""
		const start = value.length
		this.state = Input.newState(
			{
				value,
				selection: { start, end: start, direction: "none" },
			},
			this.type,
			this.value
		)
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	componentDidRender() {
		if (this.keepFocusOnReRender) {
			this.inputElement.focus()
			this.keepFocusOnReRender = false
		}
	}

	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}

	@Method()
	async getFormData(name: string): Promise<Record<string, any>> {
		const result: Record<string, any> = {}
		const form = document.forms.namedItem(name)
		if (form) {
			const elements = form.elements
			for (let i = 0; i < elements.length; i++) {
				const element = elements.item(i)
				if (this.hasNameAndValue(element) && element.name)
					result[element.name] = element.value
			}
			// Overwrite values with values from smoothly-input
			const smoothlyInputs = form.getElementsByTagName("smoothly-input")
			for (let i = 0; i < smoothlyInputs.length; i++) {
				const element = smoothlyInputs.item(i)
				if (this.hasNameAndValue(element) && element.name)
					result[element.name] = element.value
			}
		}
		return result
	}

	hasNameAndValue(element: any): element is { name: string; value: string } {
		return (
			typeof (element as { name?: string }).name == "string" && typeof (element as { value?: string }).value == "string"
		)
	}

	@Method()
	async setKeepFocusOnReRender(keepFocus: boolean) {
		this.keepFocusOnReRender = keepFocus
	}

	@Method()
	async setSelectionRange(start: number, end: number, direction?: Direction) {
		this.state = Input.newState(
			{
				...this.state,
				selection: { start, end, direction: direction != undefined ? direction : this.state.selection.direction },
			},
			this.type,
			this.value
		)

		const after = Input.formatter(this.type, this.currency).format(
			StateEditor.copy(Input.formatter(this.type, this.currency).unformat(StateEditor.copy({ ...this.state })))
		)
		Input.updateBackend(after, this.inputElement, this.state, this.value, this.type, this.currency)
	}

	render() {
		return (
			<Host
				class={{ "has-value": this.state?.value != undefined && this.state?.value != "" }}
				onclick={() => this.inputElement?.focus()}>
				<InputField
					state={this.state}
					name={this.name}
					type={this.state?.type}
					placeholder={this.placeholder}
					required={this.required}
					autocomplete={this.autocomplete}
					disabled={this.disabled}
					readonly={this.readonly}
					value={this.state?.value}
					// ref={(el: HTMLInputElement) => (this.inputElement = el)}
				/>
			</Host>
		)
	}
}
