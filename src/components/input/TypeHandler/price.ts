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
	filter(character: string, index: number, accumulated: string): boolean {
		let result = character >= "0" && character <= "9" || character == "."
		if (accumulated.includes(".")) {
			if (character == ".")
				result = false
			else {
				const decimalPosition = accumulated.indexOf(".")
				const decimals = accumulated.length - decimalPosition - 1
				const maxDecimals = 2 // TODO: Get from isoly
				if (index > decimalPosition && decimals >= maxDecimals)
					result = false
			}
		}
		return result
	}
	formatState(state: StateEditor): State {
		let beforeSeparator = state.value.length
		let separator: number
		if (state.value.includes(".")) {
			separator = state.value.indexOf(".")
			beforeSeparator = separator
		}
		const spaces = Math.ceil(beforeSeparator / 3) - 1
		if (spaces > 0) {
			for (let i = 0; i < spaces; i++) {
				const position = beforeSeparator - (spaces - i) * 3
				state.insert(" ", position)
				beforeSeparator++
			}
		}
		return state
	}
}
TypeHandler.add("price", component => new Price(component))
