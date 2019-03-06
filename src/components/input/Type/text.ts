import * as browser from "../browser"
import { Base } from "./Base"
import { Component } from "../Component"
import { Type } from "./Type"

class Text extends Base {
	get type(): browser.Type { return "text" }
	constructor(component: Component) {
		super(component)
	}
}
Type.add("text", component => new Text(component))
