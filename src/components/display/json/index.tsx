import { Component, Prop, h, VNode} from "@stencil/core"
import { JsonValue } from "./JsonValue"

@Component({
	tag: "smoothly-display-json",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayJson {
	@Prop() value: any

	render(): VNode {
		return <JsonValue value={this.value}></JsonValue>
	}
}
