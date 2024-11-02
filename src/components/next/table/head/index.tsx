import { Component, Element, h, Host, State, VNode } from "@stencil/core"
import { Scrollable } from "../../../../model"

@Component({
	tag: "smoothly-next-table-head",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTableHead {
	@Element() element: HTMLSmoothlyNextTableElement
	private scrollParent?: HTMLElement
	@State() scrolled?: boolean

	connectedCallback() {
		this.scrollParent = Scrollable.findParent(this.element)
		this.scrollParent?.addEventListener("scroll", event => {
			const parent = event.target as HTMLElement
			const relativeX = this.element.offsetTop - parent.offsetTop
			this.scrolled = relativeX <= parent.scrollTop
		})
	}

	render(): VNode | VNode[] {
		return (
			<Host class={{ scrolled: !!this.scrolled }}>
				<slot />
			</Host>
		)
	}
}
