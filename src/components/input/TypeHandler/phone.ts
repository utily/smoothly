import { Base } from "./Base"
import { Component } from "../Component"
import { State } from "../State"
import { StateEditor } from "../StateEditor"
import { TypeHandler } from "./TypeHandler"
import { phonePrefix } from "./phonePrefix"

class Phone extends Base {
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
		const result = character >= "0" && character <= "9"
		return result
	}
	formatState(state: StateEditor): State {
		for (const prefix of phonePrefix) {
			if (state.value.startsWith(prefix) && !state.value.includes("-")) {
				state.insert("-", prefix.length)
			}
		}
		if (state.value.includes("-")) {
			const digitIndex = state.value.indexOf("-") + 1
			const digitCount = state.value.substring(digitIndex, state.value.length + 1).length
			switch (digitCount) {
				case 4:
					state.insert(" ", digitIndex + 2)
					break
				case 5:
					state.insert(" ", digitIndex + 3)
					break
				case 6:
					state.insert(" ", digitIndex + 2)
					state.insert(" ", digitIndex + 5)
					break
				case 7:
					state.insert(" ", digitIndex + 3)
					state.insert(" ", digitIndex + 6)
					break
				case 8:
					state.insert(" ", digitIndex + 3)
					state.insert(" ", digitIndex + 7)
				default:
					break
			}
		}
		return state
	}
}
TypeHandler.add("phone", component => new Phone(component))
