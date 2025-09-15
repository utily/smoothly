import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-cell",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableCell {
	@Prop({ reflect: true }) span?: number = 1
	@Prop({ reflect: true }) header?: string
	@Prop({ reflect: true }) cardArea?: "checkbox" | "primary" | "status" | "actions"

	render(): VNode | VNode[] {
		return (
			<Host style={{ "--smoothly-table-cell-span": this.span?.toString(10) }}>
				{this.header && <span class="smoothly-cell-header">{this.header}</span>}
				<slot />
			</Host>
		)
	}
}
