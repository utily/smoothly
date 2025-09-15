import { Component, h, Host, Listen, Prop, State, VNode } from "@stencil/core"
import { SmoothlyTableExpandableCellCustomEvent } from "../../components"

@Component({
	tag: "smoothly-table",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTable {
	@Prop() columns = 1
	@Prop() stackAt?: string
	@State() mode: "stacked" | "table" = "table"

	@Listen("smoothlyTableExpandableRowChange")
	smoothlyTableExpandableRowChange(event: SmoothlyTableExpandableCellCustomEvent<boolean>): void {
		event.stopPropagation()
	}

	@Listen("smoothlyTableExpandableCellChange")
	smoothlyTableExpandableCellChange(event: SmoothlyTableExpandableCellCustomEvent<boolean>): void {
		event.stopPropagation()
	}

	componentWillLoad() {
		if (this.stackAt) {
			const mql = window.matchMedia(`(max-width: ${this.stackAt})`)
			this.mode = mql.matches ? "stacked" : "table"
			mql.addEventListener("change", e => {
				this.mode = e.matches ? "stacked" : "table"
			})
		}
	}

	render(): VNode | VNode[] {
		return (
			<Host class={{ stacked: this.mode == "stacked" }} style={{ "--columns": this.columns.toString() }}>
				<slot />
			</Host>
		)
	}
}
