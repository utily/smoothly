import { Component, h, Host, Listen, Prop, VNode } from "@stencil/core"
import { SmoothlyNextTableExpandableCellCustomEvent } from "../../../components"

@Component({
	tag: "smoothly-next-table",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTable {
	@Prop() columns = 1

	@Listen("smoothlyNextTableExpandableRowChange")
	smoothlyNextTableExpandableRowChange(event: SmoothlyNextTableExpandableCellCustomEvent<boolean>): void {
		event.stopPropagation()
	}

	@Listen("smoothlyNextTableExpandableCellChange")
	smoothlyNextTableExpandableCellChange(event: SmoothlyNextTableExpandableCellCustomEvent<boolean>): void {
		event.stopPropagation()
	}

	render(): VNode | VNode[] {
		return (
			<Host style={{ "--columns": this.columns.toString() }}>
				<slot />
			</Host>
		)
	}
}
