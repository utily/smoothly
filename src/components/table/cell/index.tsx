import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-cell",
	scoped: true,
})
export class SmoothlyTableCell {
	@Prop({ reflect: true }) span?: number = 1

	render(): VNode | VNode[] {
		return (
			<Host class="smoothly-table-cell" style={{ "--smoothly-table-cell-span": this.span?.toString(10) }}>
				<slot />
			</Host>
		)
	}
}
