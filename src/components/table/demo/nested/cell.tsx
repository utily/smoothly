import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "table-cell",
	scoped: true,
})
export class SmoothlyTableDemoNested {
	@Prop() value?: string
	render(): VNode | VNode[] {
		return (
			<Host style={{ display: "contents" }}>
				<td>{this.value}</td>
			</Host>
		)
	}
}
