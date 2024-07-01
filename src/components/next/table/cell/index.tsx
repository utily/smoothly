import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-table-cell",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTableCell {
	@Prop({ reflect: true }) span = 1

	render(): VNode | VNode[] {
		return (
			<Host style={{ "--smoothly-table-colspan": this.span.toString(10) }}>
				<slot />
			</Host>
		)
	}
}
