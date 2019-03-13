import * as browser from "../browser"
import { Base } from "./Base"
import { Component } from "../Component"
import { TypeHandler } from "./TypeHandler"

class Text extends Base {
	constructor(component: Component<any>) {
		super(component)
	}
}
TypeHandler.add("text", component => new Text(component))
