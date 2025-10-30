import { Component, Event, EventEmitter, h, Prop } from "@stencil/core"
import { Color, Fill } from "../../model"
@Component({
	tag: "smoothly-summary",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySummary {
	@Prop({ mutable: true, reflect: true }) open = false
	@Prop() color: Color
	@Prop() fill: Fill = "solid"
	@Prop() size: "tiny" | "small" | "medium" | "large" = "tiny"
	@Event() smoothlySummaryOpen: EventEmitter<boolean>

	async toggleHandler(event: Event) {
		if (event.target instanceof HTMLDetailsElement) {
			this.open = event.target.open
			this.smoothlySummaryOpen.emit(this.open)
		}
	}

	render() {
		return (
			<details onToggle={e => this.toggleHandler(e)} open={this.open}>
				<summary>
					<smoothly-icon name="caret-forward" color={this.color} fill={this.fill} size={this.size} />
					<slot name="summary" />
				</summary>
				<slot name="content" />
			</details>
		)
	}
}
