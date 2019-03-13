import * as browser from "../browser"
import { State } from "../State"
import { KeyEvent } from "../KeyEvent"
import { Component } from "../Component"

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
	onFocus(event: FocusEvent) {
		this.stateValue = { ...this.state, selectionStart: 0, selectionEnd: this.state.value.length }
	}
	onClick(event: MouseEvent) {
		const backend = event.target as HTMLInputElement
		this.state = { value: backend.value, selectionStart: backend.selectionStart || backend.value.length, selectionEnd: backend.selectionEnd || backend.value.length }
	}
	onKeyDown(event: KeyboardEvent) {
		if (event.key.length == 1 || event.key == "ArrowLeft" || event.key == "ArrowRight" || event.key == "Delete" || event.key == "Backspace" || event.key == "Home" || event.key == "End") {
			event.preventDefault()
			const backend = event.target as HTMLInputElement
			const before = this.state
			const after = this.keyEventHandler(before, event)
			if (after.value != before.value)
				backend.value = after.value
			if (after.selectionStart != before.selectionStart)
				backend.selectionStart = after.selectionStart
			if (after.selectionEnd != before.selectionEnd)
				backend.selectionEnd = after.selectionEnd
			this.state = after
		}
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
