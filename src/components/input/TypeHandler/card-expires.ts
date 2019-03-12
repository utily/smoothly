import * as browser from "../browser"
import { Base } from "./Base"
import { Component } from "../Component"
import { TypeHandler } from "./TypeHandler"

class CardExpires extends Base {
	get type(): browser.Type { return "text" }
	get autocomplete(): browser.Autocomplete { return "cc-exp" }
	get minLength(): number { return 4 }
	get maxLength(): number { return 4 }
	get pattern(): RegExp | undefined { return /^[01]\d[-/]\d{2}$/ }
	constructor(component: Component) {
		super(component)
	}
	protected getValue(): string {
		const value =  this.component.value as [number, number]
		return value[0].toString().padStart(2, "0") + value[1].toString().padStart(2, "0")
	}
	protected setValue(value: string) {
		this.component.value = value.length == 4 ? [Number.parseInt(value.slice(0, 2)), Number.parseInt(value.slice(2, 4))] : [0, 0]
	}
	filter(character: string, index: number, accumulated: string): boolean {
		return character >= "0" && character <= "9" && super.filter(character, index, accumulated)
	}
	format(character: string, index: number, accumulated: string): string {
		let result: string
		switch (accumulated.length) {
			case 0:
				result = (character > "1" ? "0" : "") + character
				break
			case 1:
			case 4:
				result = character
				break
			case 2:
				result = "/" + character
				break
			default:
				result = ""
		}
		return result
	}
}
TypeHandler.add("card-expires", component => new CardExpires(component))
