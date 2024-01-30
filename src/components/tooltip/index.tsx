import { Component, Element, h, Host, Prop } from "@stencil/core"
import { Color } from "../../model"

@Component({
	tag: "smoothly-tooltip",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTooltip {
	@Element() element: HTMLElement
	@Prop() toolTip: string
	@Prop() color: Color
	componentWillLoad() {
		this.element.title = this.toolTip
	}

	render() {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
