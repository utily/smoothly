import { Component, Element, h, Host, Listen, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-table-body",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTableBody {
	@Element() element: HTMLElement
	@Prop({ reflect: true, mutable: true }) open = false
	@Prop({ reflect: true }) group = false

	@Listen("smoothlyNextTableRowClick")
	tableRowClickHandler(event: CustomEvent<void>): void {
		event.stopPropagation()
		if (this.element.children[0] == event.target)
			this.open = !this.open
	}

	render(): VNode | VNode[] {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
