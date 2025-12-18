import { Component, Element, h, Host, Listen, Prop, State, VNode } from "@stencil/core"
import { SmoothlyTableExpandableCellCustomEvent } from "../../components"

@Component({
	tag: "smoothly-table",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTable {
	@Element() element: HTMLElement
	@Prop() columns = 1
	@State() topOffset = 0

	@Listen("smoothlyTableExpandableRowChange")
	smoothlyTableExpandableRowChange(event: SmoothlyTableExpandableCellCustomEvent<boolean>): void {
		event.stopPropagation()
	}

	@Listen("smoothlyTableExpandableCellChange")
	smoothlyTableExpandableCellChange(event: SmoothlyTableExpandableCellCustomEvent<boolean>): void {
		event.stopPropagation()
	}

	// getTopOffset() {
	// 	let height = 0
	// 	let currentElement = this.element
	// 	while (currentElement) {
	// 		console.log("currentElement", currentElement.tagName)
	// 		if (currentElement.tagName.toLowerCase() === "smoothly-table") {
	// 			const head = Array.from(currentElement.children).find(el => el.tagName.toLowerCase() === "smoothly-table-head")
	// 			height += head?.clientHeight || 0
	// 			console.log("its a table!", height)
	// 		}
	// 		currentElement = currentElement.parentElement as HTMLElement
	// 	}
	// 	this.topOffset = height
	// 	console.log("topOffset", this.topOffset)
	// }
	// connectedCallback() {
	// 	this.getTopOffset()
	// }

	render(): VNode | VNode[] {
		return (
			<Host style={{ "--columns": this.columns.toString() } as any}>
				<slot />
			</Host>
		)
	}
}
