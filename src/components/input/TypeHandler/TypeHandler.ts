import * as browser from "../browser"
import { State } from "../State"
import { KeyEvent } from "../KeyEvent"
import { Component } from "../Component"

export abstract class TypeHandler {
	get type(): browser.Type { return browser.Type.as(this.component.type) }
	get minLength(): number { return this.component.minLength }
	get maxLength(): number { return this.component.maxLength }
	get autocomplete(): browser.Autocomplete { return this.component.autocomplete }
	get pattern(): RegExp | undefined { return this.component.pattern }
	get placeholder(): string | undefined { return this.component.placeholder }
	get value(): string { return this.state.value }
	set value(value: string) { this.state = { ...this.state, value } }
	get internalValue(): string { return this.value }
	set internalValue(value: string) { this.value = value }
	private lastInternalValue: string = ""
	protected get componentValue(): string { return this.component.value || "" }
	protected set componentValue(value: string) { this.component.value = value }
	private blockOnValueChange = false
	private stateValue: Readonly<State> = { value: "", selectionStart: 0, selectionEnd: 0 }
	private get state(): Readonly<State> { return this.stateValue }
	private set state(state: Readonly<State>) {
		const updateComponent = this.stateValue.value != state.value
		if (updateComponent || this.stateValue.selectionStart != state.selectionStart || this.stateValue.selectionEnd != state.selectionEnd) {
			this.stateValue = state
			if (updateComponent) {
				this.componentValue = this.lastInternalValue = this.internalValue
				console.log(this.internalValue)
				console.log(this.component.value)
			}
		}
	}
	protected constructor(protected readonly component: Component) {
		this.state = { value: this.componentValue, selectionStart: this.componentValue.length, selectionEnd: this.componentValue.length }
	}
	onValueChange() {
		const value = this.componentValue
		console.log("onValueChange")
		console.log(this.lastInternalValue)
		console.log(value)
		console.log(this.lastInternalValue != value)
		// if (this.lastInternalValue != value)
		// 	this.internalValue = value
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
	onClick(event: MouseEvent) {
		const backend = event.target as HTMLInputElement
		this.state = { value: backend.value, selectionStart: backend.selectionStart || backend.value.length, selectionEnd: backend.selectionEnd || backend.value.length }
	}
	abstract keyEventHandler(state: State, event?: KeyEvent): State
	static creators: { [type: string]: (component: Component) => TypeHandler } = {}
	static add(type: string, creator: (component: Component) => TypeHandler) {
		TypeHandler.creators[type] = creator
	}
	static create(component: Component): TypeHandler {
		return (TypeHandler.creators[component.type] || TypeHandler.creators.text)(component)
	}
}
