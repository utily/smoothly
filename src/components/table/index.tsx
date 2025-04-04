import { Component, h, Host, Prop, VNode } from "@stencil/core"
// import { SmoothlyTableExpandableCellCustomEvent } from "../../components"

@Component({
	tag: "smoothly-table",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTable {
	@Prop() columns = 1

	// @Listen("smoothlyTableExpandableRowChange")
	// smoothlyTableExpandableRowChange(event: SmoothlyTableExpandableCellCustomEvent<boolean>): void {
	// 	event.stopPropagation()
	// }

	// @Listen("smoothlyTableExpandableCellChange")
	// smoothlyTableExpandableCellChange(event: SmoothlyTableExpandableCellCustomEvent<boolean>): void {
	// 	event.stopPropagation()
	// }

	render(): VNode | VNode[] {
		return (
			<Host style={{ "--columns": this.columns.toString() }}>
				<slot />
			</Host>
		)
	}
}
