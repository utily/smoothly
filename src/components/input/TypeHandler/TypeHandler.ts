import * as browser from "../browser"
import { State } from "../State"
import { KeyEvent } from "../KeyEvent"
import { Component } from "../Component"

export abstract class TypeHandler {
	get value(): string { return this.getValue() }
	set value(v: string) { this.setValue(v) }
	get type(): browser.Type { return browser.Type.as(this.component.type) }
	get minLength(): number { return this.component.minLength }
	get maxLength(): number { return this.component.maxLength }
	get autocomplete(): browser.Autocomplete { return this.component.autocomplete }
	get pattern(): RegExp | undefined { return this.component.pattern }
	get placeholder(): string | undefined { return this.component.placeholder }
	private stateValue: State = { value: "", selectionStart: 0, selectionEnd: 0 }
	private get state(): State {
		return { ...this.stateValue, value: this.value }
	}
	private set state(value: State) {
		this.stateValue = value
		this.value = value.value
	}
	protected constructor(protected readonly component: Component) {
		this.state = { value: component.value, selectionStart: component.value.length, selectionEnd: component.value.length }
	}
	protected getValue(): string { return this.component.value }
	protected setValue(value: string) { this.component.value = value }
	onKeyDown(event: KeyboardEvent) {
		if (event.key.length == 1 || event.key == "ArrowLeft" || event.key == "ArrowRight" || event.key == "Delete" || event.key == "Backspace" || event.key == "Home" || event.key == "End") {
			event.preventDefault()
			const backend = event.target as HTMLInputElement
			const before = this.state
			const after = this.keyEventHandler(before, event)
			if (after.value != before.value)
				this.value = backend.value = after.value
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
	static create(component: Partial<Component>): TypeHandler {
		const c: Component = { value: component.value || "", type: component.type || "text", minLength: component.minLength || 0, maxLength: component.maxLength || Number.POSITIVE_INFINITY, autocomplete: component.autocomplete || "on", pattern: component.pattern, placeholder: component.placeholder }
		return (TypeHandler.creators[c.type] || TypeHandler.creators.text)(c)
	}
}
