import { Component, Element, h, Host, State, VNode } from "@stencil/core"
import { Scrollable } from "../../../model"

@Component({
	tag: "smoothly-table-functional-head",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyTableShadowHead {
	@Element() element: HTMLSmoothlyTableElement
	@State() scrolled?: boolean
	private scrollParent?: HTMLElement
	private onScroll = (event: Event) => {
		if (event.target instanceof HTMLElement) {
			this.scrollParent = event.target
			const parentRect = this.scrollParent.getBoundingClientRect()
			const elementRect = this.element.getBoundingClientRect()
			this.scrolled = parentRect.top == elementRect.top
		}
	}

	connectedCallback() {
		this.scrollParent = Scrollable.findParent(this.element)
		this.scrollParent?.addEventListener("scroll", this.onScroll)
	}
	disconnectedCallback() {
		this.scrollParent?.removeEventListener("scroll", this.onScroll)
	}

	render(): VNode | VNode[] {
		return (
			<Host class={{ scrolled: !!this.scrolled }}>
				<slot />
			</Host>
		)
	}
}
