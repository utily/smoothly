import { Component, Prop, h, Host, VNode} from "@stencil/core"

@Component({
	tag: "smoothly-display-json-record",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyJsonRecord {
	
	@Prop() value: Record<string, any>
	@Prop({reflect: true, mutable: true}) open = true

	render(): VNode {
		return <Host class={{empty: Object.keys(this.value).length == 0}}>
				<span class="open-bracket" onClick={() => this.open = !this.open}>{"{"}</span>
				<span class="content">
						{Object.entries(this.value).map(([k, v]) => (
							<div class="indent">{
							<smoothly-display-json-key value={k}></smoothly-display-json-key>
						}: {
							<smoothly-display-json value={v}></smoothly-display-json>
						},</div>))}
				</span>
				<span>{"}"}</span>
			</Host>
	}
}
