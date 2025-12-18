import { Component, Element, h, Host, Prop, State, VNode } from "@stencil/core"
import { Scrollable } from "../../../model"

@Component({
	tag: "smoothly-table-head",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableHead {
	@Prop() name = ""
	@Element() element: HTMLSmoothlyTableHeadElement
	@State() scrolled?: boolean
	@State() topOffset = 0
	private scrollParent?: HTMLElement
	private onScroll = (event: Event) => {
		if (event.target instanceof HTMLElement) {
			this.scrollParent = event.target
			const parentRect = this.scrollParent.getBoundingClientRect()
			const elementRect = this.element.getBoundingClientRect()
			this.scrolled = parentRect.top == elementRect.top
		}
	}

	getTopOffset() {
		let depth = 0
		let currentElement = this.element
		while (currentElement) {
			if (currentElement.tagName.toLowerCase() === "smoothly-table") {
				const heads = Array.from(currentElement.children).filter(el => {
					return (
						el.tagName.toLowerCase() === "smoothly-table-head" &&
						el !== this.element &&
						el.compareDocumentPosition(this.element) & Node.DOCUMENT_POSITION_FOLLOWING
					)
				}) as HTMLElement[]
				for (const head of heads) {
					depth += Array.from(head.children).filter(el => el.tagName.toLowerCase() === "smoothly-table-row").length
				}
			}
			currentElement = currentElement.parentElement as HTMLSmoothlyTableHeadElement
		}
		this.topOffset = depth
	}

	connectedCallback() {
		this.scrollParent = Scrollable.findParent(this.element)
		this.scrollParent?.addEventListener("scroll", this.onScroll)
		this.getTopOffset()
	}
	disconnectedCallback() {
		this.scrollParent?.removeEventListener("scroll", this.onScroll)
	}
	render(): VNode | VNode[] {
		return (
			<Host
				class={{ scrolled: !!this.scrolled }}
				style={{ top: `calc(${this.topOffset} * var(--smoothly-table-cell-min-height))` }}>
				<slot />
			</Host>
		)
	}
}
