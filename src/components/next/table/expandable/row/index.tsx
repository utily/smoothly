import { Component, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-table-expandable-row",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTableExpandableRow {
	private div?: HTMLDivElement
	@Prop({ mutable: true, reflect: true }) open = false

	clickHandler(event: MouseEvent): void {
		;(this.div && event.composedPath().includes(this.div)) || (this.open = !this.open)
	}
	render(): VNode | VNode[] {
		return (
			<Host onClick={(e: MouseEvent) => this.clickHandler(e)}>
				<slot></slot>
				<div ref={e => (this.div = e)}>
					<slot name="detail" />
				</div>
			</Host>
		)
	}
}
