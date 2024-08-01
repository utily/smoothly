import { Component, Prop, h, Host, VNode} from "@stencil/core"

@Component({
	tag: "smoothly-display-json-array",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayJson {
	@Prop() value: any[]
	@Prop({reflect: true, mutable: true}) open = true

	render(): VNode {
		return <Host>
				<span class="open-bracket" onClick={() => this.open = !this.open}>{"["}</span>
				<span class="content">
					{this.value.map(v => <div class="indent"><smoothly-display-json value={v}></smoothly-display-json>,</div>)}
				</span>
				<span>{"]"}</span>
			</Host>
	}
}
