import { Component, Element, h, Host, Prop, State, VNode, Watch } from "@stencil/core"
import { Scrollable } from "../../../../model"

@Component({
	tag: "smoothly-table-row-lazy",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableRowLazy {
	private scrollableParent?: HTMLElement
	private rows: Record<number, VNode | undefined> = {}
	@Element() element: HTMLSmoothlyTableRowLazyElement
	@Prop() data: any[]
	@Prop() row: (entry: any, index: number) => VNode
	@State() topSpacerHeight: number = 0
	@State() from: number = 0
	@State() to: number = 25

	connectedCallback() {
		this.scrollableParent = Scrollable.findParent(this.element)
		this.scrollableParent?.addEventListener("scroll", this.onScroll.bind(this))
	}

	@Watch("from")
	fromChange(from: number, oldFrom: number) {
		const oldRows = this.rows[oldFrom]
		const oldRow = Array.isArray(oldRows) ? oldRows[0] : oldRows
		oldRow?.$elm$
	}

	onScroll(event: Event) {
		// TODO - debounce
		// Update from and to
	}

	render(): VNode {
		return (
			<Host>
				<div class="top-spacer" style={{ "--top-height-spacer": `${this.topSpacerHeight}px` }} />
				{this.data.slice(this.from, this.to).map((data, i) => {
					const index = this.from + i
					this.rows[index] = this.row(data, index)
					return this.rows[index]
				})}
			</Host>
		)
	}
}
