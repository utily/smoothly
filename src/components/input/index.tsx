import { Component, Event, EventEmitter, h, Prop, State, Watch } from "@stencil/core"
import { Currency } from "isoly"
import * as tidily from "tidily"
import { Autocomplete } from "../../model"
@Component({
	tag: "smoothly-input",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInput {
	@Prop({ reflect: true }) name: string
	private lastValue: any
	@Prop({ mutable: true }) value: any
	@Prop({ reflect: true }) type = "text"
	@Prop({ mutable: true, reflect: true }) required = false
	@Prop({ mutable: true }) minLength = 0
	@Prop({ mutable: true }) maxLength: number = Number.POSITIVE_INFINITY
	@Prop({ mutable: true }) autocomplete: Autocomplete = "on"
	@Prop({ mutable: true }) pattern: RegExp | undefined
	@Prop({ mutable: true }) placeholder: string | undefined
	@Prop({ mutable: true }) disabled = false
	@Prop({ reflect: true }) currency?: Currency
	@State() state: Readonly<tidily.State> & Readonly<tidily.Settings>
	get formatter(): tidily.Formatter & tidily.Converter<any> {
		let result: (tidily.Formatter & tidily.Converter<any>) | undefined
		switch (this.type) {
			case "price":
				result = tidily.get("price", this.currency)
				break
			default:
				result = tidily.get(this.type as tidily.Type)
				break
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return result || tidily.get("text")!
	}
	@Event() smoothlyChanged: EventEmitter<{ name: string; value: any }>
	@Watch("value")
	valueWatcher(value: any, before: any) {
		if (this.lastValue != value) {
			this.lastValue = value
			this.state = {
				...this.state,
				value: this.formatter.format(
					tidily.StateEditor.copy(
						this.formatter.unformat(tidily.StateEditor.copy({ value, selection: this.state.selection }))
					)
				).value,
			}
		}
		if (value != before)
			this.smoothlyChanged.emit({ name: this.name, value })
	}
	componentWillLoad() {
		const formatter = this.formatter
		const value = formatter.toString(this.value) || ""
		const start = value.length
		this.state = formatter.format(
			tidily.StateEditor.copy(
				formatter.unformat(
					tidily.StateEditor.copy({
						value,
						selection: { start, end: start, direction: "none" },
					})
				)
			)
		)
	}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	onBlur(event: FocusEvent) {}
	onFocus(event: FocusEvent) {
		const after = this.formatter.format(
			tidily.StateEditor.copy(this.formatter.unformat(tidily.StateEditor.copy({ ...this.state })))
		)
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
		const after = this.formatter.format(
			tidily.StateEditor.copy(this.formatter.unformat(tidily.StateEditor.copy({ ...this.state })))
		)
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
				(!(event.ctrlKey && event.key == "v") && event.key.length == 1) ||
				event.key == "ArrowLeft" ||
				event.key == "ArrowRight" ||
				event.key == "Delete" ||
				event.key == "Backspace" ||
				event.key == "Home" ||
				event.key == "End"
			) {
				event.preventDefault()
				this.processKey(event, backend)
			}
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
	private processKey(event: tidily.Action, backend: HTMLInputElement) {
		const after = tidily.Action.apply(this.formatter, this.state, event)
		this.updateBackend(after, backend)
	}
	updateBackend(after: Readonly<tidily.State> & Readonly<tidily.Settings>, backend: HTMLInputElement) {
		if (after.value != backend.value)
			backend.value = after.value
		if (backend.selectionStart != undefined && after.selection.start != backend.selectionStart)
			backend.selectionStart = after.selection.start
		if (backend.selectionEnd != undefined && after.selection.end != backend.selectionEnd)
			backend.selectionEnd = after.selection.end
		backend.selectionDirection = after.selection.direction ? after.selection.direction : backend.selectionDirection
		this.state = after
		this.value = this.lastValue = this.formatter.fromString(
			this.formatter.unformat(tidily.StateEditor.copy({ ...this.state })).value
		)
	}
	hostData() {
		return { class: { "has-value": this.state?.value } }
	}
	render() {
		return [
			<input
				name={this.name}
				type={this.state.type}
				placeholder={this.placeholder}
				required={this.required}
				autocomplete={this.state.autocomplete}
				disabled={this.disabled}
				pattern={this.state.pattern && this.state.pattern.source}
				value={this.state.value}
				onInput={(e: InputEvent) => this.onInput(e)}
				onFocus={e => this.onFocus(e)}
				onClick={e => this.onClick(e)}
				onBlur={e => this.onBlur(e)}
				onKeyDown={e => this.onKeyDown(e)}
				onPaste={e => this.onPaste(e)}></input>,
			<smoothly-icon name="alert-circle" color="danger" fill="clear" size="small"></smoothly-icon>,
			<label htmlFor={this.name}>
				<slot />
			</label>,
		]
	}
}
