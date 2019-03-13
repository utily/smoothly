import * as browser from "../browser"
import { Base } from "./Base"
import { Component } from "../Component"
import { TypeHandler } from "./TypeHandler"

class CardCsc extends Base {
	get native(): Component<string> {
		const result = super.native
		return {
			...result,
			type: "text",
			autocomplete: "cc-csc",
			minLength: 3,
			maxLength: 3,
			pattern: /^\d{3}$/,
		}
	}
	constructor(component: Component<any>) {
		super(component)
	}
	filter(character: string, index: number, accumulated: string): boolean {
		return character >= "0" && character <= "9" && index < 3
	}
	format(character: string, index: number, accumulated: string): string {
		return character
	}
}
TypeHandler.add("card-csc", component => new CardCsc(component))
