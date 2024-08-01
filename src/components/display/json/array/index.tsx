import { Component, Prop, h, Host, VNode} from "@stencil/core"
import { JsonValue } from "../JsonValue"

@Component({
	tag: "smoothly-display-json-array",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayJsonArray {
	@Prop() value: any[]
	@Prop({reflect: true, mutable: true}) open = true

	render(): VNode {
		return <Host class={{empty: this.value.length == 0}}>
				<span class="open-bracket" onClick={() => this.open = !this.open}>{"["}</span>
				<span class="content">
					{this.value.map(v => <div class="indent"><JsonValue value={v}></JsonValue>,</div>)}
				</span>
				<span>{"]"}</span>
			</Host>
	}
}
