import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-display-json-primitive",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayJsonPrimitive {
	@Prop() value: any

	render(): VNode {
		return <Host class={this.value == null ? "null" : typeof this.value}>{"" + JSON.stringify(this.value)}</Host>
	}
}
