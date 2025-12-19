import { Component, Element, h, Host, State, VNode } from "@stencil/core"
import { Scrollable } from "../../../model"

@Component({
	tag: "smoothly-table-head",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableHead {
	@Element() element: HTMLSmoothlyTableHeadElement
	@State() scrolled?: boolean
	@State() depth = 0
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
		let currentElement: HTMLElement | null = this.element
		while (currentElement) {
			if (currentElement.tagName.toLowerCase() === "smoothly-table") {
				const head = currentElement.querySelector("smoothly-table-head") as HTMLSmoothlyTableHeadElement
				if (head !== this.element) {
					const rows = Array.from(
						head.querySelectorAll("smoothly-table-row") as NodeListOf<HTMLSmoothlyTableHeadElement>
					)
					depth += rows.length
				}
			}
			currentElement = currentElement.parentElement as HTMLSmoothlyTableHeadElement
		}
		this.depth = depth
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
				style={
					{
						"--top": `calc(${this.depth} * var(--smoothly-table-cell-min-height))`,
						"--z-index": `${10 - this.depth}`,
					} as any
				}>
				<slot />
			</Host>
		)
	}
}
