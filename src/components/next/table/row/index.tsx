import { Component, h, Host, Listen, VNode } from "@stencil/core"
import { SmoothlyNextTableExpandableCellCustomEvent } from "../../../../components"

@Component({
	tag: "smoothly-next-table-row",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTableRow {
	private expandableCells = new Set<HTMLSmoothlyNextTableExpandableCellElement>()
	@Listen("smoothlyNextTableExpandableCellRegister")
	smoothlyNextTableExpandableCellRegisterHandler(event: SmoothlyNextTableExpandableCellCustomEvent<void>): void {
		event.stopPropagation()
		this.expandableCells.add(event.target)
	}
	@Listen("smoothlyNextTableExpandableCellOpen")
	smoothlyNextTableExpandableCellOpenHandler(event: SmoothlyNextTableExpandableCellCustomEvent<void>): void {
		event.stopPropagation()
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
