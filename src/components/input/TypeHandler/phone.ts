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
	formatState(stateEditor: StateEditor): State {
		for (const prefix of phonePrefix) {
			if (stateEditor.value.startsWith(prefix) && !stateEditor.value.includes("-")) {
				stateEditor.insert("-", prefix.length)
			}
		}
		if (stateEditor.value.includes("-")) {
			const digitIndex = stateEditor.value.indexOf("-") + 1
			const digitCount = stateEditor.value.substring(digitIndex, stateEditor.value.length + 1).length
			switch (digitCount) {
				case 4:
					stateEditor.insert(" ", digitIndex + 2)
					break
				case 5:
					stateEditor.insert(" ", digitIndex + 3)
					break
				case 6:
					stateEditor.insert(" ", digitIndex + 2)
					stateEditor.insert(" ", digitIndex + 5)
					break
				case 7:
					stateEditor.insert(" ", digitIndex + 3)
					stateEditor.insert(" ", digitIndex + 6)
					break
				case 8:
					stateEditor.insert(" ", digitIndex + 3)
					stateEditor.insert(" ", digitIndex + 7)
				default:
					break
			}
		}
		return stateEditor.stateCopy
	}
}
TypeHandler.add("phone", component => new Phone(component))
