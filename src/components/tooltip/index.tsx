import { Component, h, Host, Prop } from "@stencil/core"
import { Color } from "../../model"

@Component({
	tag: "smoothly-tooltip",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTip {
	@Prop() toolTip: string
	@Prop() color: Color
	render() {
		return (
			<Host>
				<slot />
				<span class="toolTip">{this.toolTip}</span>
			</Host>
		)
	}
}
