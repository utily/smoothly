import { Component, h, Prop } from "@stencil/core"
import { Color } from "../../model"

@Component({
	tag: "smoothly-color",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyColor {
	@Prop({ reflect: true }) color?: Color

	render() {
		return <slot />
	}
}
