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
		return (
			<smoothly-notifier>
				<slot name="header"></slot>
				<slot name="main"></slot>
				<slot></slot>
			</smoothly-notifier>
		)
	}
}
