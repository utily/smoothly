import * as browser from "../browser"
import { Base } from "./Base"
import { Component } from "../Component"
import { TypeHandler } from "./TypeHandler"

class CardExpires extends Base {
	public get value(): any {
		return super.value.length == 4 ? [Number.parseInt(super.value.slice(0, 2)), Number.parseInt(super.value.slice(2, 4))] :
			super.value.length > 0 ? [] : undefined
	}
	public set value(value: any) {
		super.value = isExpires(value) ? value[0].toString().padStart(2, "0") + value[1].toString().padStart(2, "0") : ""
	}
	get native(): Component<string> {
		const result = super.native
		return {
			...result,
			type: "text",
			autocomplete: "cc-exp",
			minLength: 5,
			maxLength: 7,
			pattern: /^[01]\d\s*[-/]\s*\d{2}$/,
		}
	}
	constructor(component: Component<any>) {
		super(component)
	}
	filter(character: string, index: number, accumulated: string): boolean {
		return character >= "0" && character <= "9" && index < 4
	}
	format(character: string, index: number, accumulated: string): string {
		let result: string
		switch (accumulated.length) {
			case 0:
				result = (character > "1" ? "0" : "") + character
				break
			case 1:
			case 6:
				result = character
				break
			case 2:
				result = " / " + character
				break
			default:
				result = ""
		}
		return result
	}
}
TypeHandler.add("card-expires", component => new CardExpires(component))

function isExpires(value: any): value is [number, number] {
	return Array.isArray(value) && value.length == 2 && typeof(value[0]) == "number" && typeof(value[1]) == "number"
}
