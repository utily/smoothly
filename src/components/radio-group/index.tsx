import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-0-radio-group",
	styleUrl: "style.css",
})
export class Smoothly0ToggleGroup {
	@Prop({ reflect: true }) orientation?: "horizontal" | "vertical" = "horizontal"
	render() {
		return <slot></slot>
	}
}
