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
				<slot name="cell"></slot>
				<smoothly-next-table-cell>
					<slot name={"detail"} />
				</smoothly-next-table-cell>
			</Host>
		)
	}
}
