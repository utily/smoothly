import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-cell",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableCell {
	@Prop({ reflect: true }) span?: number = 1
	@Prop({ reflect: true }) cardLabel?: string
	@Prop({ reflect: true }) cardArea?: "checkbox" | "primary" | "status" | "actions"
	@Prop({ reflect: true }) cardVisibility: "always" | "opened" | "hidden" = "always"

	render(): VNode | VNode[] {
		return (
			<Host class="smoothly-table-cell" style={{ "--smoothly-table-cell-span": this.span?.toString(10) }}>
				{typeof this.cardLabel == "string" && <span class="smoothly-card-field-label">{this.cardLabel}</span>}
				<slot />
			</Host>
		)
	}
}
