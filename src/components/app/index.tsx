import { Component, h, Prop } from "@stencil/core"
import { Color } from "../../model"

@Component({
	tag: "smoothly-app",
	styleUrl: "style.css",
	scoped: false,
})
export class SmoothlyApp {
	@Prop() color: Color
	render() {
		return <slot></slot>
	}
}
