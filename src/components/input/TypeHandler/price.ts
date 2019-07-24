import { Base } from "./Base"
import { Component } from "../Component"
import { TypeHandler } from "./TypeHandler"
import { StateEditor } from "../StateEditor"
import { State } from "../State"

class Price extends Base {
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
	handleBlur(stateEditor: StateEditor): State {
		if (!stateEditor.value.includes(".")) {
			stateEditor.insert(".00", stateEditor.value.length)
		}
		const index = stateEditor.value.indexOf(".")
		if (index == 0) {
			stateEditor = stateEditor.padStart(stateEditor.value.length + 1, "0")
		}
		const maxDecimals = 2 // TODO: Get from isoly
		return stateEditor.padEnd(index + maxDecimals + 1, "0").stateCopy
	}
	filter(character: string, index: number, accumulated: string): boolean {
		let result = character >= "0" && character <= "9" || character == "."
		if (accumulated.includes(".")) {
			if (character == ".")
				result = false
			else {
				const decimalPosition = accumulated.indexOf(".")
				const maxDecimals = 2 // TODO: Get from isoly
				if (index > decimalPosition + maxDecimals)
					result = false
			}
		}
		return result
	}
	formatState(stateEditor: StateEditor): State {
		let beforeSeparator = stateEditor.value.length
		let separator: number
		if (stateEditor.value.includes(".")) {
			separator = stateEditor.value.indexOf(".")
			beforeSeparator = separator
			const afterSeparator = stateEditor.value.length - separator - 1
			const maxDecimals = 2 // TODO: Get from isoly
			if (afterSeparator > maxDecimals) {
				stateEditor.truncate(separator + maxDecimals + 1)
			}
		}
		const spaces = Math.ceil(beforeSeparator / 3) - 1
		if (spaces > 0) {
			for (let i = 0; i < spaces; i++) {
				const position = beforeSeparator - (spaces - i) * 3
				stateEditor.insert(" ", position)
				beforeSeparator++
			}
		}
		return stateEditor.stateCopy
	}
}
TypeHandler.add("price", component => new Price(component))
