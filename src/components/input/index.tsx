import { Component, Event, EventEmitter, h, Host, Method, Prop, Watch } from "@stencil/core"
import { Currency, Language, Locale } from "isoly"
import { Action, Converter, Direction, Formatter, get, Settings, State, StateEditor, Type } from "tidily"
@Component({
	tag: "smoothly-input",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInput {
	private inputElement: HTMLInputElement
	/** On re-render the input will blur. This boolean is meant to keep track of if input should keep its focus. */
	private keepFocusOnReRender = false
	private lastValue: any
	private state: Readonly<State> & Readonly<Settings>
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) value: any
	@Prop({ reflect: true }) type = "text"
	@Prop({ mutable: true, reflect: true }) required = false
	@Prop({ mutable: true }) minLength = 0
	@Prop({ mutable: true }) maxLength: number = Number.POSITIVE_INFINITY
	@Prop({ mutable: true }) autocomplete = true
	@Prop({ mutable: true }) pattern: RegExp | undefined
	@Prop({ mutable: true }) placeholder: string | undefined
	@Prop({ mutable: true }) disabled = false
	@Prop({ reflect: true }) currency?: Currency
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
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return result || get("text")!
	}
	private newState(state: State) {
		const formatter = this.formatter
		return formatter.format(StateEditor.copy(formatter.unformat(StateEditor.copy(state))))
	}
	@Event() smoothlyChanged: EventEmitter<{ name: string; value: any }>
	@Watch("value")
	valueWatcher(value: any, before: any) {
		if (this.lastValue != value) {
			this.lastValue = value
			this.state = {
				...this.state,
				value: this.newState({ value: this.formatter.toString(value), selection: this.state.selection }).value,
			}
		}
		if (value != before)
			this.smoothlyChanged.emit({ name: this.name, value })
	}
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
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	onBlur(event: FocusEvent) {}
	onFocus(event: FocusEvent) {
		const after = this.formatter.format(StateEditor.copy(this.formatter.unformat(StateEditor.copy({ ...this.state }))))
		if (event.target)
			this.updateBackend(after, event.target as HTMLInputElement)
	}
	onClick(event: MouseEvent) {
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
	}
	onKeyDown(event: KeyboardEvent) {
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
				(!((event.ctrlKey || event.metaKey) && (event.key == "v" || event.key == "c")) && event.key.length == 1) ||
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
	onPaste(event: ClipboardEvent) {
		event.preventDefault()
		let pasted = event.clipboardData ? event.clipboardData.getData("text") : ""
		const backend = event.target as HTMLInputElement
		pasted = this.expiresAutocompleteFix(backend, pasted)
		for (const letter of pasted)
			this.processKey({ key: letter }, backend)
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
	private processKey(event: Action, backend: HTMLInputElement) {
		const after = Action.apply(this.formatter, this.state, event)
		this.updateBackend(after, backend)
	}
	updateBackend(after: Readonly<State> & Readonly<Settings>, backend: HTMLInputElement) {
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
	render() {
		return (
			<Host class={{ "has-value": this.state?.value != "" }}>
				<input
					name={this.name}
					type={this.state.type}
					placeholder={this.placeholder}
					required={this.required}
					autocomplete={this.autocomplete ? this.state.autocomplete : "off"}
					disabled={this.disabled}
					pattern={this.state.pattern && this.state.pattern.source}
					value={this.state.value}
					onInput={(e: InputEvent) => this.onInput(e)}
					onFocus={e => this.onFocus(e)}
					onClick={e => this.onClick(e)}
					onBlur={e => this.onBlur(e)}
					onKeyDown={e => this.onKeyDown(e)}
					ref={(el: HTMLInputElement) => (this.inputElement = el)}
					onPaste={e => this.onPaste(e)}></input>
				<smoothly-icon name="alert-circle" color="danger" fill="clear" size="small"></smoothly-icon>
				<label htmlFor={this.name}>
					<slot />
				</label>
			</Host>
		)
	}
}

function getLocale(): Locale | undefined {
	const result = navigator.language
	return Locale.is(result) ? result : Language.is(result) ? Locale.toLocale(result) : undefined
}
