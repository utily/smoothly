import { Component, h, Host, State } from "@stencil/core"
import { isoly } from "isoly"

@Component({
	tag: "smoothly-input-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDemo {
	@State() duration: isoly.TimeSpan = { hours: 8 }
	@State() alphanumeric: string = "!@##"

	render() {
		return (
			<Host>
				<smoothly-input name="normal">Text</smoothly-input>
				<smoothly-input name="normal" autoFocus>
					AutoFocus here!
				</smoothly-input>
			</Host>
		)
	}
}
