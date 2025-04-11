import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-shadow-cell",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyTableShadowCell {
	@Prop({ reflect: true }) span?: number = 1

	render(): VNode | VNode[] {
		return (
			<Host style={{ "--smoothly-table-cell-span": this.span?.toString(10) }}>
				<slot />
			</Host>
		)
	}
}
