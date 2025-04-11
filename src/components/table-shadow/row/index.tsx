import { Component, h, Host, Listen, VNode } from "@stencil/core"
import { SmoothlyTableExpandableCellCustomEvent } from "../../../components"

@Component({
	tag: "smoothly-table-shadow-row",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyTableShadowRow {
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
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
