import { Component, Prop } from "@stencil/core"
import { Color } from "../../../../model"

@Component({
	tag: "smoothly-theme-color-variant",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyThemeColorVariant {
	@Prop({ reflect: true }) color: Color
	@Prop({ reflect: true }) variant: "shade" | "tint" | "color" = "color"
	render() {
		return "Aa"
	}
}
