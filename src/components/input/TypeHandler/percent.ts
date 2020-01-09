import { Base } from "./Base"
import { Component } from "../Component"
import { TypeHandler } from "./TypeHandler"
import { StateEditor } from "../StateEditor"
import { State } from "../State"

class Percent extends Base {
	get native(): Component<string> {
		const result = super.native
		return {
			...result,
			type: "text",
		}
	}
	constructor(component: Component<any>) {
		super(component)
	}
	public get value() {
		let filtered = ""
		for (const c of super.value.toString())
			if (this.filter(c, filtered.length, filtered))
				filtered += c
		return filtered
	}
	public set value(value: any) {
		if (this.blockNext)
			this.blockNext = false
		else
			super.value = value
	}
	filter(character: string, index: number, accumulated: string): boolean {
		let result = character >= "0" && character <= "9" || character == "."
		if (accumulated.includes(".") && character == ".")
			result = false
		return result
	}
	formatState(stateEditor: StateEditor): State {
		let beforeSeparator = stateEditor.value.length
		let separator: number
		if (stateEditor.value.includes(".")) {
			separator = stateEditor.value.indexOf(".")
			beforeSeparator = separator
		}
		const spaces = Math.ceil(beforeSeparator / 3) - 1
		if (spaces > 0) {
			for (let i = 0; i < spaces; i++) {
				const position = beforeSeparator - (spaces - i) * 3
				stateEditor.insert(" ", position)
				beforeSeparator++
			}
		}
		if (stateEditor.value.length > 1 && stateEditor.value.substring(0, 1) == "0" && stateEditor.value.substring(1, 2) >= "0" && stateEditor.value.substring(1, 2) <= "9")
			stateEditor.delete(0)
		if (!stateEditor.value.includes("%")) {
			stateEditor.insert(" %", stateEditor.value.length)
			const current = stateEditor.toState()
			if (current.selectionStart > stateEditor.value.length - 2)
				current.selectionStart = stateEditor.value.length - 2
			if (current.selectionEnd > stateEditor.value.length - 2)
				current.selectionEnd = stateEditor.value.length - 2
			stateEditor = StateEditor.copy(current)
		}
		return stateEditor.toState()
	}
}
TypeHandler.add("percent", component => new Percent(component))
