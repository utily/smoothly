import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-input-tooltip",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyInputTooltip {
	@Prop() open = false
	@Prop() content: string | HTMLElement

	render() {
		return (
			<Host>
				<div class={`tooltip ${this.open ? "show" : ""}`}>{this.content}</div>
			</Host>
		)
	}
}
