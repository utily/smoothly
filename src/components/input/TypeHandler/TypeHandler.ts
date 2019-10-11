import { Component } from "../Component"
import { KeyEvent } from "../KeyEvent"
import { State } from "../State"
import { StateEditor } from "../StateEditor"

export abstract class TypeHandler {
	get value(): any { return this.state.value }
	set value(value: any) {
		if (this.blockNextSet)
			this.blockNextSet = false
		else
			this.state = { ...this.state, value }
	}
	get native(): Component<string> { return { ...this.component, value: this.state.value } }
	private blockNextSet = false
	private stateValue: Readonly<State> = { value: "", selectionStart: 0, selectionEnd: 0 }
	private get state(): Readonly<State> { return this.stateValue }
	private set state(state: Readonly<State>) {
		const updateComponent = this.stateValue.value != state.value
		if (updateComponent || this.stateValue.selectionStart != state.selectionStart || this.stateValue.selectionEnd != state.selectionEnd) {
			this.stateValue = state
			if (updateComponent) {
				this.blockNextSet = true
				this.component.value = this.value
			}
		}
	}
	protected constructor(protected readonly component: Component<any>) {
		this.value = this.component.value
	}
	onBlur(event: FocusEvent) {
		this.state = this.handleLeaving(StateEditor.copy(this.state))
	}
	handleLeaving(stateEditor: StateEditor): State {
		return stateEditor.toState()
	}
	onFocus(event: FocusEvent) {
		this.stateValue = { ...this.state, selectionStart: 0, selectionEnd: this.state.value.length }
	}
	onClick(event: MouseEvent) {
		const backend = event.target as HTMLInputElement
		this.state = { value: backend.value, selectionStart: backend.selectionStart != undefined ? backend.selectionStart : backend.value.length, selectionEnd: backend.selectionEnd != undefined ? backend.selectionEnd : backend.value.length }
	}
	onKeyDown(event: KeyboardEvent) {
		const backend = event.target as HTMLInputElement
		this.state = { value: backend.value, selectionStart: backend.selectionStart != undefined ? backend.selectionStart : backend.value.length, selectionEnd: backend.selectionEnd != undefined ? backend.selectionEnd : backend.value.length }
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
	private processKey(event: KeyEvent, backend: HTMLInputElement){
		const after = this.keyEventHandler(this.state, event)
		if (after.value != backend.value)
			backend.value = after.value
		if (after.selectionStart != backend.selectionStart)
			backend.selectionStart = after.selectionStart
		if (after.selectionEnd != backend.selectionEnd)
			backend.selectionEnd = after.selectionEnd
		this.state = after
	}
	abstract keyEventHandler(state: State, event?: KeyEvent): State
	static creators: { [type: string]: (component: Component<any>) => TypeHandler } = {}
	static add(type: string, creator: (component: Component<any>) => TypeHandler) {
		TypeHandler.creators[type] = creator
	}
	static create(component: Component<any>): TypeHandler {
		return (TypeHandler.creators[component.type] || TypeHandler.creators.text)(component)
	}
}
