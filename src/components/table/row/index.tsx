import { Component, h, Host, Listen, VNode } from "@stencil/core"
import { SmoothlyTableExpandableCellCustomEvent } from "../../../components"

@Component({
	tag: "smoothly-table-row",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableRow {
	private expandableCells = new Set<HTMLSmoothlyTableExpandableCellElement>()
	@Listen("smoothlyTableExpandableCellRegister")
	smoothlyTableExpandableCellRegisterHandler(event: SmoothlyTableExpandableCellCustomEvent<void>): void {
		event.stopPropagation()
		this.expandableCells.add(event.target)
	}
	@Listen("smoothlyTableExpandableCellChange")
	smoothlyTableExpandableCellChangeHandler(event: SmoothlyTableExpandableCellCustomEvent<boolean>): void {
		if (event.detail)
			for (const cell of this.expandableCells)
				event.target != cell && cell.close()
	}

	render(): VNode | VNode[] {
		return <Host></Host>
	}
}
