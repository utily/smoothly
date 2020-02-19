import * as tidily from "tidily"
import { Component } from "./Component"

export class TypeHandler {
	private blockNextSet = false
	get blockNext(): boolean { return this.blockNextSet }
	set blockNext(block: boolean) { this.blockNextSet = block }
	get value(): any { return this.state.value }
	set value(value: any) {
		this.state = { ...this.state, value }
	}
	get native(): Component<string> { return { ...this.component, value: this.state.value } }
	private stateValue: Readonly<tidily.State> = { value: "", selection: { start: 0, end: 0 } }
	private get state(): Readonly<tidily.State> { return this.stateValue }
	private set state(state: Readonly<tidily.State>) {
		const updateComponent = this.stateValue.value != state.value
		if (updateComponent || this.stateValue.selection.start != state.selection.start || this.stateValue.selection.end != state.selection.end) {
			this.stateValue = state
			if (updateComponent) {
				this.blockNextSet = true
				this.component.value = this.value
			}
		}
	}
	private constructor(protected readonly component: Component<any>) {
		this.value = this.component.value
	}
	onBlur(event: FocusEvent) {
		this.state = this.handleLeaving(tidily.StateEditor.copy(this.state))
	}
	handleLeaving(stateEditor: tidily.StateEditor): tidily.State {
		return stateEditor
	}
	onFocus(event: FocusEvent) {
		this.stateValue = { ...this.state, selection: { start: 0, end: this.state.value.length } }
	}
	onClick(event: MouseEvent) {
		const backend = event.target as HTMLInputElement
		this.state = {
			value: backend.value,
			selection: {
				start: backend.selectionStart != undefined ? backend.selectionStart : backend.value.length,
				end: backend.selectionEnd != undefined ? backend.selectionEnd : backend.value.length,
			},
		}
	}
	onKeyDown(event: KeyboardEvent) {
		const backend = event.target as HTMLInputElement
		this.state = {
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
	onPaste(event: ClipboardEvent) {
		event.preventDefault()
		const pasted = event.clipboardData ? event.clipboardData.getData("text") : ""
		const backend = event.target as HTMLInputElement
		for (const letter of pasted) {
			this.processKey({ key: letter }, backend)
		}
	}
	private processKey(event: tidily.Action, backend: HTMLInputElement){
		const formatter = tidily.get(this.component.type as tidily.Type)
		if (formatter) {
			const after = tidily.Action.apply(formatter, this.state, event)
			if (after.value != backend.value)
				backend.value = after.value
			if (after.selection.start != backend.selectionStart)
				backend.selectionStart = after.selection.start
			if (after.selection.end != backend.selectionEnd)
				backend.selectionEnd = after.selection.end
			this.state = after
		}
	}
	static create(component: Component<any>): TypeHandler {
		return new TypeHandler(component)
	}
}
