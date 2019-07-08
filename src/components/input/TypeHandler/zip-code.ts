import { Base } from "./Base"
import { Component } from "../Component"
import { TypeHandler } from "./TypeHandler"

class ZipCode extends Base {
	get native(): Component<string> {
		const result = super.native
		return {
			...result,
			type: "text",
			minLength: 5,
			maxLength: 7,
		}
	}
	constructor(component: Component<any>) {
		super(component)
	}
	filter(character: string, index: number, accumulated: string): boolean {
		return character >= "0" && character <= "9" && index < 5
	}
	format(character: string, index: number, accumulated: string): string {
		let result: string
		switch (accumulated.length) {
			case 0:
			case 1:
			case 2:
				result = character
				break
			case 3:
				result = " " + character
				break
			case 4:
			case 5:
				result = character
				break
			default:
				result = ""
		}
		return result
	}
}
TypeHandler.add("zip-code", component => new ZipCode(component))
