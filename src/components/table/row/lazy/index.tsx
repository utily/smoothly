import { Component, Element, h, Host, Prop, State, VNode } from "@stencil/core"
import { Scrollable } from "../../../../model"

@Component({
	tag: "smoothly-table-row-lazy",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableRowLazy {
	private scrollableParent?: HTMLElement
	private rows: Record<number, HTMLElement> = {}
	private debounceTimer: NodeJS.Timeout
	@Element() element: HTMLSmoothlyTableRowLazyElement
	@Prop() data: any[]
	@Prop() row: (entry: any, index: number, refCallback: (el?: HTMLElement) => void) => VNode
	@State() topSpacerHeight: number = 0
	@State() from: number = 0
	@State() to: number = 25

	connectedCallback() {
		this.scrollableParent = Scrollable.findParent(this.element)
		this.scrollableParent?.addEventListener("scroll", this.onScroll.bind(this))
	}

	debounce(func: () => void, wait: number = 300) {
		clearTimeout(this.debounceTimer)
		this.debounceTimer = setTimeout(() => {
			func.apply(this)
		}, wait)
	}

	onScroll(event: MouseEvent) {
		this.debounce(() => {
			console.log("scroll", event)
			let firstVisibleRowIndex: number
			for (let i = this.from; i <= this.to; i++) {
				const row = this.rows[i]
				const bottomVisible = Scrollable.isBottomVisible(row)
				console.log("row", i, bottomVisible, row)
				if (bottomVisible) {
					firstVisibleRowIndex = i
					console.log("first", firstVisibleRowIndex, row)
					const rowTop = row.getBoundingClientRect().top
					const hostTop = this.element.getBoundingClientRect().top
					this.topSpacerHeight = rowTop - hostTop
					console.log("topSpaceHeight", this.topSpacerHeight)
					// this.topSpacerHeight
					// this.from = firstVisibleRowIndex
					break
				}
			}
		})
		// TODO - debounce
		// Find first rendered row
		// 		change from
		// 		updateTopSpacerHeight
		// Find last rendered row
		// 		change to
		// Update from and to
	}
	componentDidLoad() {
		console.log("rows", this.rows)
	}

	render(): VNode {
		return (
			<Host>
				<div class="top-spacer" style={{ "--top-height-spacer": `${this.topSpacerHeight}px` }} />
				{this.data.slice(this.from, this.to).map((data, i) => {
					const index = this.from + i
					return this.row(data, index, el => (el ? (this.rows[index] = el) : delete this.rows[index]))
				})}
			</Host>
		)
	}
}
