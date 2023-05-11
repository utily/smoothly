import { Component, h, Listen, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-table-row",
	styleUrl: "style.css",
	scoped: true,
})
export class TableRow {
	private element?: HTMLElement
	@Prop({ reflect: true, mutable: true }) open = false
	expansions: HTMLSmoothlyTableExpandableCellElement[] = []
	@Listen("smoothlyExpansionLoad")
	onExpansionLoad(event: CustomEvent<void>) {
		this.expansions.push(event.target as HTMLSmoothlyTableExpandableCellElement)
	}
	@Listen("smoothlyExpandableChange")
	onExpansionChange() {
		this.open = this.expansions.some(expansion => expansion.open)
	}
	@Listen("smoothlyExpansionOpen")
	onExpansionOpen(event: CustomEvent<HTMLElement | undefined>) {
		this.expansions.forEach(cell => {
			if (cell != event.target)
				cell.open = false
		})
		if (event.detail)
			this.element?.after(event.detail)
	}
	render() {
		return (
			<div ref={e => (this.element = e)}>
				<slot></slot>
			</div>
		)
	}
}
