import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-table-expandable-cell",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTableExpandableCell {
	@Prop({ mutable: true, reflect: true }) open = false

	clickHandler(): void {
		this.open = !this.open
	}

	render(): VNode | VNode[] {
		return (
			<Host>
				<div onClick={() => this.clickHandler()} class={"content"}>
					<slot />
				</div>
				<div class={"detail"}>
					<slot name={"detail"} />
				</div>
			</Host>
		)
	}
}
