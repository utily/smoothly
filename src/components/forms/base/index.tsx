import { Component, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from "@stencil/core"
import { Currency, Language, Locale } from "isoly"
import { Action, Converter, Direction, Formatter, get, Settings, State as TidilyState, StateEditor, Type } from "tidily"
import { Clearable } from "../Clearable"

function getLocale(): Locale | undefined {
	const result = navigator.language
	return Locale.is(result) ? result : Language.is(result) ? Locale.toLocale(result) : undefined
}

@Component({
	tag: "smoothly-input-base",
	styleUrl: "index.css",
	scoped: true,
})
export class SmoothlyInputBase implements Clearable {
	@Prop() name: string
	@Prop() type = "text"
	@Prop() required = false
	@Prop() minLength = 0
	@Prop() maxLength: number = Number.POSITIVE_INFINITY
	@Prop() autocomplete = true
	@Prop() pattern: RegExp | undefined
	@Prop({ reflect: true }) placeholder: string | undefined
	@Prop({ mutable: true, reflect: true }) value: any
	@Prop({ mutable: true }) disabled = false
	@Prop({ mutable: true }) readonly = false
	@Prop() currency?: Currency
	@Prop() focused: boolean
	@State() initialValue?: any
	@Event() input: EventEmitter<{ value: any }>
	@Event() focus: EventEmitter
	@Event() blur: EventEmitter
	@Event() click: EventEmitter
	private inputElement: HTMLInputElement
	private keepFocusOnReRender = false
	private lastValue: any
	private state: Readonly<TidilyState> & Readonly<Settings>

	componentWillLoad() {
		const value = this.formatter.toString(this.value) || ""
		const start = value.length
		this.state = this.newState({
			value,
			selection: { start, end: start, direction: "none" },
		})
	}

	componentDidRender() {
		if (this.keepFocusOnReRender) {
			this.inputElement.focus()
			this.keepFocusOnReRender = false
		}
	}

	@Watch("value")
	valueWatcher(value: any, before: any) {
		if (this.lastValue != value) {
			this.lastValue = value
			this.state = {
				...this.state,
				value: this.newState({ value: this.formatter.toString(value), selection: this.state.selection }).value,
			}
		}
		this.input.emit({ value: this.value })
	}

	@Watch("currency")
	onCurrency() {
		this.state = {
			...this.state,
			value: this.newState({ value: this.formatter.toString(this.value), selection: this.state.selection }).value,
			pattern: this.newState({ value: this.formatter.toString(this.value), selection: this.state.selection }).pattern,
		}
	}

	@Method()
	async setKeepFocusOnReRender(keepFocus: boolean) {
		this.keepFocusOnReRender = keepFocus
	}

	@Method()
	async setSelectionRange(start: number, end: number, direction?: Direction) {
		this.state = this.newState({
			...this.state,
			selection: { start, end, direction: direction != undefined ? direction : this.state.selection.direction },
		})

		const after = this.formatter.format(StateEditor.copy(this.formatter.unformat(StateEditor.copy({ ...this.state }))))
		this.updateBackend(after, this.inputElement)
	}

	get formatter(): Formatter & Converter<any> {
		let result: (Formatter & Converter<any>) | undefined
		switch (this.type) {
			case "price":
				result = get("price", this.currency)
				break
			default:
				result = get(this.type as Type, getLocale())
				break
		}
		return result || (get("text") as Formatter & Converter<any>)
	}

	private newState(state: TidilyState) {
		const formatter = this.formatter
		return formatter.format(StateEditor.copy(formatter.unformat(StateEditor.copy(state))))
	}

	private onBlur() {
		this.initialValue = undefined
		this.blur.emit()
	}

	private onFocus(event: FocusEvent) {
		this.initialValue = this.value
		const after = this.formatter.format(StateEditor.copy(this.formatter.unformat(StateEditor.copy({ ...this.state }))))
		if (event.target)
			this.updateBackend(after, event.target as HTMLInputElement)
		this.focus.emit()
	}

	private onClick(event: MouseEvent) {
		const backend = event.target as HTMLInputElement
		this.state = {
			...this.state,
			value: backend.value,
			selection: {
				start: backend.selectionStart != undefined ? backend.selectionStart : backend.value.length,
				end: backend.selectionEnd != undefined ? backend.selectionEnd : backend.value.length,
				direction: backend.selectionDirection ? backend.selectionDirection : "none",
			},
		}
		const after = this.newState({ ...this.state })
		this.updateBackend(after, backend)
		this.click.emit()
	}

	private onKeyDown(event: KeyboardEvent) {
		if (event.key && !(event.key == "Unidentified")) {
			const backend = event.target as HTMLInputElement
			this.state = {
				...this.state,
				value: backend.value,
				selection: {
					start: backend.selectionStart != undefined ? backend.selectionStart : backend.value.length,
					end: backend.selectionEnd != undefined ? backend.selectionEnd : backend.value.length,
					direction: backend.selectionDirection ? backend.selectionDirection : "none",
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
		}
	}

	private onPaste(event: ClipboardEvent) {
		event.preventDefault()
		let pasted = event.clipboardData ? event.clipboardData.getData("text") : ""
		const backend = event.target as HTMLInputElement
		pasted = this.expiresAutocompleteFix(backend, pasted)
		for (const letter of pasted)
			this.processKey({ key: letter }, backend)
	}

	private onInput(event: InputEvent) {
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

	private processKey(event: Action, backend: HTMLInputElement) {
		if (!this.readonly) {
			const after = Action.apply(this.formatter, this.state, event)
			this.updateBackend(after, backend)
		}
	}

	updateBackend(after: Readonly<TidilyState> & Readonly<Settings>, backend: HTMLInputElement) {
		if (after.value != backend.value)
			backend.value = after.value
		if (backend.selectionStart != undefined && after.selection.start != backend.selectionStart)
			backend.selectionStart = after.selection.start
		if (backend.selectionEnd != undefined && after.selection.end != backend.selectionEnd)
			backend.selectionEnd = after.selection.end
		backend.selectionDirection = after.selection.direction ? after.selection.direction : backend.selectionDirection
		this.state = after
		this.value = this.lastValue = this.formatter.fromString(
			this.formatter.unformat(StateEditor.copy({ ...this.state })).value
		)
	}

	@Method()
	async clear() {
		const value = ""
		const start = value.length
		this.state = this.newState({
			value,
			selection: { start, end: start, direction: "none" },
		})
	}

	@Method()
	async setFocus() {
		this.inputElement.focus()
	}

	@Method()
	async setBlur() {
		this.inputElement.blur()
	}

	render() {
		return (
			<Host onClick={() => this.inputElement.focus()}>
				<input
					class={!this.placeholder && !this.value && !this.focused ? "fadeIn" : ""}
					name={this.name}
					type={this.state?.type}
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
					onBlur={e => this.onBlur()}
					onKeyDown={e => this.onKeyDown(e)}
					ref={(el: HTMLInputElement) => (this.inputElement = el)}
					onPaste={e => this.onPaste(e)}
				/>
			</Host>
		)
	}
}
