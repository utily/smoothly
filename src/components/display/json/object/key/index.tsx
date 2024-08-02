import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-display-json-record-key",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayJsonRecordKey {
	@Prop() value: any

	render(): VNode {
		return <Host>"{this.value}"</Host>
	}
}
