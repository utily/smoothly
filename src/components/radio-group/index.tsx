import { Component, Prop, h } from "@stencil/core"

@Component({
	tag: "smoothly-radio-group",
	styleUrl: "style.css",
})
export class SmoothlyToggleGroup {
	@Prop({ reflect: true }) orientation?: "horizontal" | "vertical" = "horizontal"
	render() {
		return <slot></slot>
	}
}
