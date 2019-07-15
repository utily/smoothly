import { Base } from "./Base"
import { Component } from "../Component"
import { TypeHandler } from "./TypeHandler"

class Password extends Base {
	constructor(component: Component<any>) {
		super(component)
	}
	get native(): Component<string> {
		const result = super.native
		return {
			...result,
			type: "password",
			autocomplete: "current-password",
		}
	}
}
TypeHandler.add("password", component => new Password(component))
