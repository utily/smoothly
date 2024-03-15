import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-table-expandable-row",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTableExpandableRow {
	@Prop({ mutable: true, reflect: true }) open = false

	clickHandler(): void {
		console.log("click")
		this.open = !this.open
	}
	render(): VNode | VNode[] {
		return (
			<Host onClick={() => this.clickHandler()}>
				<slot></slot>
				<div>
					<slot name="detail" />
				</div>
			</Host>
		)
	}
}
