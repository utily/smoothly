import { Component, Prop, h, Host, VNode} from "@stencil/core"
import { JsonValue } from "../JsonValue"

@Component({
	tag: "smoothly-display-json-record",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayJsonRecord {
	
	@Prop() value: Record<string, any>
	@Prop({reflect: true, mutable: true}) open = true

	render(): VNode {
		return <Host class={{empty: Object.keys(this.value).length == 0}}>
				<span class="open-bracket" onClick={() => this.open = !this.open}>{"{"}</span>
				<span class="content">
						{Object.entries(this.value).map(([k, v]) => (
							<div class="indent">{
							<smoothly-display-json-record-key value={k}></smoothly-display-json-record-key>
						}: {
							<JsonValue value={v}></JsonValue>
						},</div>))}
				</span>
				<span>{"}"}</span>
			</Host>
	}
}
