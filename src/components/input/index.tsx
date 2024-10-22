import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { tidily } from "tidily"
import { Color } from "../../model"
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
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true }) name: string
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
	@Prop() invalid?: boolean = false
	@Prop({ mutable: true }) changed = false
	@State() formatter: tidily.Formatter & tidily.Converter<any>
	@State() initialValue?: any
	private inputElement: HTMLInputElement
	/** On re-render the input will blur. This boolean is meant to keep track of if input should keep its focus. */
	private keepFocusOnReRender = false
	private lastValue: any
	private state: Readonly<tidily.State> & Readonly<tidily.Settings>
	private uneditable = this.readonly
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyInputRemove: EventEmitter<(parent: HTMLElement) => void> // Wont work because element disconnects
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	@Event() smoothlyBlur: EventEmitter<void>
	@Event() smoothlyChange: EventEmitter<Record<string, any>>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>

	@Method()
	async getValue(): Promise<any | undefined> {
		return this.value
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>): Promise<void> {
		this.listener[property] = listener
		listener(this)
	}
	@Listen("smoothlyInputLoad")
	async SmoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInput) => void>): Promise<void> {
		if (!(event.target && "name" in event.target && event.target.name == this.name)) {
			event.stopPropagation()
			event.detail(this)
		}
	}
	@Watch("currency")
	@Watch("type")
	typeChange(): void {
		let result: (tidily.Formatter & tidily.Converter<any>) | undefined
		switch (this.type) {
			case "price":
				result = tidily.get("price", { currency: this.currency, toInteger: this.toInteger })
				break
			default:
				result = tidily.get(this.type, getLocale())
				break
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.formatter = result || tidily.get("text")!
	}
	private newState(state: tidily.State) {
		return this.formatter.format(tidily.StateEditor.copy(this.formatter.unformat(tidily.StateEditor.copy(state))))
	}
	@Watch("value")
	async valueWatcher(value: any, before: any) {
		this.changed = this.initialValue !== this.value
		if (this.lastValue != value) {
			this.lastValue = value
			this.state = {
				...this.state,
				value: this.newState({ value: this.formatter.toString(value), selection: this.state.selection }).value,
			}
		}
		if (value != before)
			this.smoothlyInput.emit({ [this.name]: await this.getValue() })
		this.listener.changed?.(this)
	}
	@Watch("readonly")
	watchingReadonly() {
		this.listener.changed?.(this)
	}
	@Watch("currency")
	onCurrency() {
		this.state = {
			...this.state,
			value: this.newState({ value: this.formatter.toString(this.value), selection: this.state.selection }).value,
			pattern: this.newState({ value: this.formatter.toString(this.value), selection: this.state.selection }).pattern,
		}
	}
	componentWillLoad() {
		this.typeChange()
		const value = this.formatter.toString(this.value) || ""
		this.lastValue = this.initialValue = this.value
		const start = value.length
		this.state = this.newState({
			value,
			selection: { start, end: start, direction: "none" },
		})
		this.smoothlyInputLooks.emit(
			(looks, color) => ((this.looks = this.looks ?? looks), !this.color && (this.color = color))
		)
		this.smoothlyInputLoad.emit(() => {})
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.listener.changed?.(this)
	}
	componentDidRender() {
		if (this.keepFocusOnReRender) {
			this.inputElement.focus()
			this.keepFocusOnReRender = false
		}
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
	async setSelectionRange(start: number, end: number, direction?: tidily.Direction) {
		this.state = this.newState({
			...this.state,
			selection: { start, end, direction: direction ?? this.state.selection.direction },
		})
		const after = this.formatter.format(
			tidily.StateEditor.copy(this.formatter.unformat(tidily.StateEditor.copy({ ...this.state })))
		)
		this.updateBackend(after, this.inputElement)
	}
	onBlur(event: FocusEvent) {
		this.smoothlyBlur.emit()
		const value = typeof this.value == "string" ? this.value.trim() : this.value
		this.smoothlyInput.emit({ [this.name]: value })
		if (this.initialValue != this.value)
			this.smoothlyChange.emit({ [this.name]: this.value })
	}
	onFocus(event: FocusEvent) {
		const after = this.formatter.format(
			tidily.StateEditor.copy(this.formatter.unformat(tidily.StateEditor.copy({ ...this.state })))
		)
		if (event.target)
			this.updateBackend(after, event.target as HTMLInputElement, false)
	}
	onClick(event: MouseEvent) {
		const backend = event.target as HTMLInputElement
		this.state = {
			...this.state,
			value: backend.value,
			selection: {
				start: backend.selectionStart ?? backend.value.length,
				end: backend.selectionEnd ?? backend.value.length,
				direction: backend.selectionDirection ?? "none",
			},
		}
		const after = this.newState({ ...this.state })
		this.updateBackend(after, backend)
	}
	onKeyDown(event: KeyboardEvent) {
		if (event.key && !(event.key == "Unidentified")) {
			const backend = event.target as HTMLInputElement
			this.state = {
				...this.state,
				value: backend.value,
				selection: {
					start: backend.selectionStart ?? backend.value.length,
					end: backend.selectionEnd ?? backend.value.length,
					direction: backend.selectionDirection ?? "none",
				},
			}
			if (
				(!((event.ctrlKey || event.metaKey) && (event.key == "v" || event.key == "x" || event.key == "c")) &&
					event.key.length == 1) ||
				event.key == "ArrowLeft" ||
				event.key == "ArrowRight" ||
				event.key == "Delete" ||
				event.key == "Backspace" ||
				event.key == "Home" ||
				event.key == "End"
			) {
				event.preventDefault()
				this.processKey(event, backend)
			} else if (event.key == "ArrowUp" || event.key == "ArrowDown")
				event.preventDefault()
			else if (event.key == "Enter")
				this.smoothlyBlur.emit()
		}
	}
	onPaste(event: ClipboardEvent) {
		event.preventDefault()
		let pasted = event.clipboardData ? event.clipboardData.getData("text") : ""
		const backend = event.target as HTMLInputElement
		pasted = this.expiresAutocompleteFix(backend, pasted)
		this.processPaste(pasted, backend)
	}
	onInput(event: InputEvent) {
		if (event.inputType == "insertReplacementText") {
			this.processKey({ key: "a", ctrlKey: true }, event.target as HTMLInputElement)
			;[...(event.data ?? "")].forEach(c => this.processKey({ key: c }, event.target as HTMLInputElement))
		} else {
			const backend = event.target as HTMLInputElement
			let data = backend.value
			if (data) {
				event.preventDefault()
				this.processKey({ key: "a", ctrlKey: true }, backend)
				data = this.expiresAutocompleteFix(backend, data)
				for (const letter of data)
					this.processKey({ key: letter }, backend)
			}
		}
	}
	private expiresAutocompleteFix(backend: HTMLInputElement, value: string) {
		if (backend.attributes.getNamedItem("autocomplete")?.value == "cc-exp")
			value = value.match(/^20\d\d[.\D]*\d\d$/)
				? value.substring(value.length - 2, value.length) + value.substring(2, 4)
				: value.match(/^(1[3-9]|[2-9]\d)[.\D]*\d\d$/)
				? value.substring(value.length - 2, value.length) + value.substring(0, 2)
				: value.match(/^\d\d[.\D]*20\d\d$/)
				? value.substring(0, 2) + value.substring(value.length - 2, value.length)
				: value
		return value
	}
	private processPaste(pasted: string, backend: HTMLInputElement) {
		if (!this.readonly) {
			const after = tidily.Action.paste(this.formatter, this.state, pasted)
			this.updateBackend(after, backend)
		}
	}
	private processKey(event: tidily.Action, backend: HTMLInputElement) {
		if (!this.readonly) {
			const after = tidily.Action.apply(this.formatter, this.state, event)
			this.updateBackend(after, backend)
		}
	}
	updateBackend(
		after: Readonly<tidily.State> & Readonly<tidily.Settings>,
		backend: HTMLInputElement,
		setSelection = true
	) {
		if (after.value != backend.value)
			backend.value = after.value
		if (setSelection) {
			if (backend.selectionStart != undefined && after.selection.start != backend.selectionStart)
				backend.selectionStart = after.selection.start
			if (backend.selectionEnd != undefined && after.selection.end != backend.selectionEnd)
				backend.selectionEnd = after.selection.end
			if (backend.selectionDirection != null)
				backend.selectionDirection = after.selection.direction ?? backend.selectionDirection
		}
		this.state = after
		this.value = this.lastValue = this.formatter.fromString(
			this.formatter.unformat(tidily.StateEditor.copy({ ...this.state })).value
		)
	}
	render() {
		return (
			<Host
				class={{
					"has-value": this.state?.value != undefined && this.state?.value != "",
					invalid: !!this.invalid,
				}}
				onclick={() => this.inputElement?.focus()}>
				<slot name="start"></slot>
				<div>
					<input
						color={this.color}
						name={this.name}
						type={this.state?.type}
						inputmode={this.state?.inputmode}
						placeholder={this.placeholder}
						required={this.required}
						autocomplete={this.autocomplete ? this.state?.autocomplete : "off"}
						disabled={this.disabled}
						readOnly={this.readonly}
						pattern={this.state?.pattern && this.state?.pattern.source}
						value={this.state?.value}
						onInput={(e: InputEvent) => this.onInput(e)}
						onFocus={e => this.onFocus(e)}
						onClick={e => this.onClick(e)}
						onBlur={e => this.onBlur(e)}
						onKeyDown={e => this.onKeyDown(e)}
						ref={(el: HTMLInputElement) => (this.inputElement = el)}
						onPaste={e => this.onPaste(e)}></input>
					<label class={"label float-on-focus"} htmlFor={this.name}>
						<slot />
					</label>
					<smoothly-icon name="alert-circle" color="danger" fill="clear" size="small"></smoothly-icon>
				</div>
				<slot name="end"></slot>
			</Host>
		)
	}
}

function getLocale(): isoly.Locale | undefined {
	const result = navigator.language
	return isoly.Locale.is(result) ? result : isoly.Language.is(result) ? isoly.Locale.toLocale(result) : undefined
}
