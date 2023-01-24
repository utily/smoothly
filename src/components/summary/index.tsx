import { Component, h, Prop } from "@stencil/core"
import { Color, Fill } from "../../model"
@Component({
	tag: "smoothly-summary",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySummary {
	@Prop() color: Color = "primary"
	@Prop() fill: Fill = "solid"
	@Prop() size: "tiny" | "small" | "medium" | "large" = "tiny"

	render() {
		return (
			<details>
				<summary>
					<smoothly-icon name="chevron-forward" color={this.color} fill={this.fill} size={this.size}></smoothly-icon>
					<slot name="summary"></slot>
				</summary>
				<slot name="content"></slot>
			</details>
		)
	}
}
