import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-radio-group",
	styleUrl: "style.css",
})
export class SmoothlyRadioGroup {
	@Prop({ reflect: true }) orientation?: "horizontal" | "vertical" = "horizontal"
	render() {
		return <slot></slot>
	}
}
