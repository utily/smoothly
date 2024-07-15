import { Component, h, Host, Prop } from "@stencil/core"
import { Color } from "../../../model"

@Component({
	tag: "smoothly-theme-color",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyThemeColor {
	@Prop() color: Color
	render() {
		return (
			<Host>
				{this.color}
				{(["tint", "color", "shade"] as const).map(variant => (
					<smoothly-theme-color-variant
						title={`${this.color} ${variant}`}
						color={this.color}
						variant={variant}></smoothly-theme-color-variant>
				))}
			</Host>
		)
	}
}
