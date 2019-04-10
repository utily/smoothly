import { Component, Prop } from "@stencil/core"
import { DateTime } from "isoly"

@Component({
	tag: "smoothly-display-date-time",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayDateTime {
	@Prop() datetime: DateTime

	render() {

		const datetime = this.datetime.split("T")

		return [
			datetime[0],
			" ",
			datetime[1],
		]
	}
}
