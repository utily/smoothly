import * as browser from "../browser"
import { Base } from "./Base"
import { Component } from "../Component"
import { TypeHandler } from "./TypeHandler"

class CardCsc extends Base {
	get type(): browser.Type { return "text" }
	get autocomplete(): browser.Autocomplete { return "cc-csc" }
	get minLength(): number { return 3 }
	get maxLength(): number { return 3 }
	get pattern(): RegExp | undefined { return /^\d{3}$/ }
	constructor(component: Component) {
		super(component)
	}
	filter(character: string, index: number, accumulated: string): boolean {
		return character >= "0" && character <= "9" && super.filter(character, index, accumulated)
	}
	format(character: string, index: number, accumulated: string): string {
		return character
	}
}
TypeHandler.add("card-csc", component => new CardCsc(component))
