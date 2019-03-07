import * as browser from "../browser"
import { Base } from "./Base"
import { Component } from "../Component"
import { TypeHandler } from "./TypeHandler"

class Text extends Base {
	get type(): browser.Type { return "text" }
	constructor(component: Component) {
		super(component)
	}
}
TypeHandler.add("text", component => new Text(component))
