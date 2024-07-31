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
				<smoothly-input>text</smoothly-input>
				<smoothly-input-next type="card-number"></smoothly-input-next>
				<smoothly-input type="card-number">card-number</smoothly-input>
				<smoothly-input-next type="email"></smoothly-input-next>
				<smoothly-input type="email">email</smoothly-input>
				<smoothly-input-next type="phone"></smoothly-input-next>
				<smoothly-input type="phone">phone</smoothly-input>
				<smoothly-input-next type="integer"></smoothly-input-next>
				<smoothly-input type="integer">integer</smoothly-input>
				<smoothly-input-next type="password"></smoothly-input-next>
				<smoothly-input type="password">password</smoothly-input>
			</Host>
		)
	}
}
