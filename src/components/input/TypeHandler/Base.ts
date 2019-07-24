import { State } from "../State"
import { KeyEvent } from "../KeyEvent"
import { TypeHandler } from "./TypeHandler"
import { Component } from "../Component"
import { StateEditor } from "../StateEditor"

export class Base extends TypeHandler {
	get value(): any {
		const value = typeof(super.value) == "string" ? super.value : ""
		let result = ""
		let index = 0
		for (const character of value)
			if (this.filter(character, index, result)) {
				result += character
				index++
			}
		return result
	}
	set value(value: any) {
		if (typeof(value) != "string")
			value = ""
		let result = ""
		let index = 0
		for (const next of value)
			result += this.format(next, index++, result)
		super.value = result
	}
	protected constructor(component: Component<any>) {
		super(component)
	}
	filter(character: string, index: number, accumulated: string): boolean {
		return character.length == 1
	}
	format(character: string, index: number, accumulated: string): string {
		return character
	}
	private filterState(state: Readonly<State>): State {
		const result = { ...state, value: "" }
		const before = state.value
		let index = 0
		for (const character of before) {
			if (this.filter(character, index, result.value)) {
				result.value += character
				index++
			} else {
				if (result.selectionStart > index)
					result.selectionStart--
				if (result.selectionEnd > index)
					result.selectionEnd--
			}
		}
		return result
	}
	formatState(state: StateEditor): State {
		const result = { value: "", selectionStart: state.selectionStart, selectionEnd: state.selectionEnd }
		const before = state.value
		let index = 0
		for (let next of before) {
			next = this.format(next, index++, result.value)
			const delta = next.length - 1
			if (result.selectionStart > result.value.length)
				result.selectionStart += delta
			if (result.selectionEnd > result.value.length)
				result.selectionEnd += delta
			result.value += next
		}
		return result
	}
	keyEventHandler(state: Readonly<State>, event?: KeyEvent): State {
		const result = this.filterState(state)
		if (event) {
			if (event.key == "ArrowLeft") {
				result.selectionStart -= result.selectionStart > 0 ? 1 : 0
				if (!event.shiftKey) // no create or extend selection
					result.selectionEnd = result.selectionStart
			} else if (event.key == "ArrowRight") {
				result.selectionEnd += result.selectionEnd < result.value.length ? 1 : 0
				if (!event.shiftKey) // no create or extend selection
					result.selectionStart = result.selectionEnd
			} else if (event.key == "Home") {
				result.selectionStart = 0
				if (!event.shiftKey) // no create or extend selection
					result.selectionEnd = result.selectionStart
			} else if (event.key == "End") {
				result.selectionEnd = result.value.length
				if (!event.shiftKey) // no create or extend selection
					result.selectionStart = result.selectionEnd
			} else if (event.ctrlKey) {
				switch (event.key) {
					case "a":
						result.selectionStart = 0
						result.selectionEnd = result.value.length
				}
			} else {
				if (result.selectionStart != result.selectionEnd) { // selection exists
					switch (event.key) {
						case "Delete":
						case "Backspace":
							event = undefined
							break
						default:
							break
					}
					result.value = result.value.substring(0, result.selectionStart) + result.value.substring(result.selectionEnd)
					result.selectionEnd = result.selectionStart
				}
				if (event)
					switch (event.key) {
						case "Unidentified": break
						case "Backspace":
							if (result.selectionStart > 0) {
								result.value = result.value.substring(0, result.selectionStart - 1) + result.value.substring(result.selectionStart)
								result.selectionStart = --result.selectionEnd
							}
							break
						case "Delete":
							if (result.selectionStart < result.value.length)
								result.value = result.value.substring(0, result.selectionStart) + result.value.substring(result.selectionStart + 1)
							break
						default:
							if (this.filter(event.key, result.selectionStart, result.value)) {
								result.value = result.value.substring(0, result.selectionStart) + event.key + result.value.substring(result.selectionStart)
								result.selectionStart = result.selectionEnd += event.key.length
							}
					}
			}
		}
		const r = this.formatState(StateEditor.copy(result))
		return { value: r.value, selectionStart: r.selectionStart, selectionEnd: r.selectionEnd }
	}
}
