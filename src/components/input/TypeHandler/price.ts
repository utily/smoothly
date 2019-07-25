import { Currency } from "isoly"
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
	private currency: Currency = "SEK"
	constructor(component: Component<any>) {
		super(component)
	}
	handleLeaving(stateEditor: StateEditor): State {
		if (!stateEditor.value.includes(".")) {
			stateEditor.insert(".", stateEditor.value.length)
		}
		let index = stateEditor.value.indexOf(".")
		if (index == 0) {
			stateEditor = stateEditor.padStart(stateEditor.value.length + 1, "0")
			index = stateEditor.value.indexOf(".")
		}
		const maxDecimals = (Currency.decimalDigits(this.currency) ? Currency.decimalDigits(this.currency) : 2) as number
		return stateEditor.padEnd(index + maxDecimals + 1, "0").toState()
	}
	filter(character: string, index: number, accumulated: string): boolean {
		let result = character >= "0" && character <= "9" || character == "."
		if (accumulated.includes(".")) {
			if (character == ".")
				result = false
			else {
				const decimalPosition = accumulated.indexOf(".")
				const maxDecimals = (Currency.decimalDigits(this.currency) ? Currency.decimalDigits(this.currency) : 2) as number
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
			const maxDecimals = (Currency.decimalDigits(this.currency) ? Currency.decimalDigits(this.currency) : 2) as number
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
		return stateEditor.toState()
	}
}
TypeHandler.add("price", component => new Price(component))
