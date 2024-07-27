import { Component, h, Host, State } from "@stencil/core"
import { isoly } from "isoly"

@Component({
	tag: "smoothly-input-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDemo {
	@State() duration: isoly.TimeSpan = { hours: 8 }

	render() {
		return (
			<Host>
				<smoothly-input-next></smoothly-input-next>
				<smoothly-input-next type="card-number"></smoothly-input-next>
				<smoothly-input looks="border">text</smoothly-input>
				<smoothly-input looks="border" type="card-number">
					card number
				</smoothly-input>
			</Host>
		)
	}
}
