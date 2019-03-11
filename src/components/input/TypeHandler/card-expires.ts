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
