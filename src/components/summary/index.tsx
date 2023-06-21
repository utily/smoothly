import { Component, h, Prop } from "@stencil/core"
import { Color, Fill } from "../../model"
@Component({
	tag: "smoothly-summary",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySummary {
	@Prop({ mutable: true, reflect: true }) open = false
	@Prop() color: Color = "primary"
	@Prop() fill: Fill = "solid"
	@Prop() size: "tiny" | "small" | "medium" | "large" = "tiny"

	toggleHandler(event: Event) {
		if (event.target instanceof HTMLDetailsElement)
			this.open = event.target.open
	}

	render() {
		return (
			<details onToggle={e => this.toggleHandler(e)} open={this.open}>
				<summary>
					<smoothly-icon name="chevron-forward" color={this.color} fill={this.fill} size={this.size}></smoothly-icon>
					<slot name="summary"></slot>
				</summary>
				<slot name="content"></slot>
			</details>
		)
	}
}
