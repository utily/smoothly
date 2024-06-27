import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-table",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTable {
	@Prop() columns = 1
	render(): VNode | VNode[] {
		return (
			<Host style={{ "--columns": this.columns.toString() }}>
				<slot />
			</Host>
		)
	}
}
