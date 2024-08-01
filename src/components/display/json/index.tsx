import { Component, Prop, h, Host, VNode} from "@stencil/core"
import { isly } from "isly"

@Component({
	tag: "smoothly-display-json",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayJson {
	@Prop() value: any

	render(): VNode {
		return <Host>{
			Array.isArray(this.value) 
				? <smoothly-display-json-array value={this.value}></smoothly-display-json-array> 
				: isly.object().is(this.value) 
				? <smoothly-display-json-record value={this.value}></smoothly-display-json-record> 
				: <smoothly-display-json-primitive value={this.value}></smoothly-display-json-primitive>
			}</Host>
	}
}
