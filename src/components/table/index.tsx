import { Component, h, Host, Listen, Prop, State, VNode } from "@stencil/core"
import { SmoothlyTableExpandableCellCustomEvent } from "../../components"

@Component({
	tag: "smoothly-table",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTable {
	@Prop() columns = 1
	@Prop({ reflect: true }) cardAt?: string
	@State() mode: "cards" | "table" = "table"

	@Listen("smoothlyTableExpandableRowChange")
	smoothlyTableExpandableRowChange(event: SmoothlyTableExpandableCellCustomEvent<boolean>): void {
		event.stopPropagation()
	}

	@Listen("smoothlyTableExpandableCellChange")
	smoothlyTableExpandableCellChange(event: SmoothlyTableExpandableCellCustomEvent<boolean>): void {
		event.stopPropagation()
	}

	componentWillLoad() {
		if (this.cardAt) {
			const mql = window.matchMedia(`(max-width: ${this.cardAt})`)
			this.mode = mql.matches ? "cards" : "table"
			mql.addEventListener("change", e => (this.mode = e.matches ? "cards" : "table"))
		}
	}

	render(): VNode | VNode[] {
		return (
			<Host class={{ cards: this.mode == "cards" }} style={{ "--columns": this.columns.toString() }}>
				<slot />
			</Host>
		)
	}
}
