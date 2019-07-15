import { Base } from "./Base"
import { Component } from "../Component"
import { TypeHandler } from "./TypeHandler"

class Email extends Base {
	constructor(component: Component<any>) {
		super(component)
	}
	get native(): Component<string> {
		const result = super.native
		return {
			...result,
			type: "text",
			autocomplete: "email",
		}
	}
}
TypeHandler.add("email", component => new Email(component))
