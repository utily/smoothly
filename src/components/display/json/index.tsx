import { Component, h, Prop, VNode } from "@stencil/core"
import { JsonValue } from "./JsonValue"

@Component({
	tag: "smoothly-display-json",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayJson {
	@Prop() value: any
	@Prop() collapsed?: boolean

	render(): VNode {
		return <JsonValue value={this.value} collapsed={this.collapsed}></JsonValue>
	}
}
