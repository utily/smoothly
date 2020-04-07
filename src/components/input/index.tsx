// tslint:disable-next-line: no-implicit-dependencies
import { Component, Event, EventEmitter, Prop, Watch, h, State } from "@stencil/core"
import { Currency } from "isoly"
import * as tidily from "tidily"
import { Autocomplete } from "./browser"
@Component({
	tag: "smoothly-input",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInput {
	@Prop({ reflectToAttr: true }) name: string
	private lastValue: any
	@Prop({ mutable: true }) value: any
	@Prop({ reflectToAttr: true }) type: string = "text"
	@Prop({ mutable: true, reflectToAttr: true }) required: boolean = false
	@Prop({ mutable: true }) minLength: number = 0
	@Prop({ mutable: true }) maxLength: number = Number.POSITIVE_INFINITY
	@Prop({ mutable: true }) autocomplete: Autocomplete = "on"
	@Prop({ mutable: true }) pattern: RegExp | undefined
	@Prop({ mutable: true }) placeholder: string | undefined
	@Prop({ mutable: true }) disabled: boolean = false
	@Prop({ reflect: true }) currency?: Currency
	@State() state: Readonly<tidily.State> & Readonly<tidily.Settings>
	get formatter(): tidily.Formatter & tidily.Converter<any> {
		let result: tidily.Formatter & tidily.Converter<any> | undefined
		switch (this.type) {
			case "price":
				result = tidily.get("price", this.currency)
				break
			default:
				result = tidily.get(this.type as tidily.Type)
				break
			}
		return result || tidily.get("text")!
	}
	@Event() smoothlyChanged: EventEmitter<{ name: string, value: any }>
	@Watch("value")
	valueWatcher(value: any, before: any) {
		if (this.lastValue != value) {
			this.lastValue = value
			this.state = { ...this.state, value: this.formatter.format(tidily.StateEditor.copy(this.formatter.unformat(tidily.StateEditor.copy({ value, selection: this.state.selection })))).value }
		}
		if (value != before)
			this.smoothlyChanged.emit({ name: this.name, value })
	}
	componentWillLoad() {
		const formatter = this.formatter
		const value = formatter.toString(this.value) || ""
		const start = value.length
		this.state = formatter.format(tidily.StateEditor.copy(formatter.unformat(tidily.StateEditor.copy({
			value,
			selection: { start, end: start },
		}))))
	}
	onBlur(event: FocusEvent) {
	}
	onFocus(event: FocusEvent) {
		const after = this.formatter.format(tidily.StateEditor.copy(this.formatter.unformat(tidily.StateEditor.copy({ ...this.state }))))
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
			}
		}
		const after = this.formatter.format(tidily.StateEditor.copy(this.formatter.unformat(tidily.StateEditor.copy({ ...this.state }))))
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
				}
			}
			if (!(event.ctrlKey && event.key == "v") &&
					event.key.length == 1 || event.key == "ArrowLeft" || event.key == "ArrowRight" ||
					event.key == "Delete" || event.key == "Backspace" || event.key == "Home" || event.key == "End") {
				event.preventDefault()
				this.processKey(event, backend)
			}
		}
	}
	onPaste(event: ClipboardEvent) {
		event.preventDefault()
		const pasted = event.clipboardData ? event.clipboardData.getData("text") : ""
		const backend = event.target as HTMLInputElement
		for (const letter of pasted)
			this.processKey({ key: letter }, backend)
	}
	onInput(event: InputEvent) {
		const backend = event.target as HTMLInputElement
		const data = backend.value
		if (data) {
			event.preventDefault()
			this.processKey({ key: "a", ctrlKey: true }, backend)
			for (const letter of data)
				this.processKey({ key: letter }, backend)
		}
	}
	private processKey(event: tidily.Action, backend: HTMLInputElement){
		const after = tidily.Action.apply(this.formatter, this.state, event)
		this.updateBackend(after, backend)
	}
	updateBackend(after: Readonly<tidily.State> & Readonly<tidily.Settings>, backend: HTMLInputElement) {
		if (after.value != backend.value)
			backend.value = after.value
		if (backend.selectionStart != undefined && (after.selection.start != backend.selectionStart)) {
			backend.selectionStart = after.selection.start
		}
		if (backend.selectionEnd != undefined && (after.selection.end != backend.selectionEnd)) {
			backend.selectionEnd = after.selection.end
		}
		this.state = after
		this.value = this.lastValue = this.formatter.fromString(this.formatter.unformat(tidily.StateEditor.copy({...this.state })).value)
	}
	hostData() {
		return { class: { "has-value": this.state?.value } }
	}
	render() {
		return [
				<input
					name={ this.name }
					type={ this.state.type }
					placeholder={ this.placeholder }
					required={ this.required }
					autocomplete={ this.state.autocomplete }
					disabled={ this.disabled }
					pattern={ this.state.pattern && this.state.pattern.source }
					value={ this.state.value }
					onInput={ (e: InputEvent) => this.onInput(e) }
					onFocus={ e => this.onFocus(e) }
					onClick={ e => this.onClick(e) }
					onBlur={ e => this.onBlur(e) }
					onKeyDown={ e => this.onKeyDown(e) }
					onPaste={ e => this.onPaste(e) }></input>,
				<label htmlFor={this.name}><slot/></label>,
			]
	}
}
