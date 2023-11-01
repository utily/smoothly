import { Component, ComponentWillLoad, Prop } from "@stencil/core"
import { DateTime } from "isoly"

/**
 * DEPRECATED, use  <smoothly-0-display type="date-time">
 */
@Component({
	tag: "smoothly-0-display-date-time",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayDateTime implements ComponentWillLoad {
	@Prop() datetime: DateTime

	componentWillLoad(): void | Promise<void> {
		console.warn('Component <smoothly-0-display-date-time> is deprecated, use <smoothly-0-display type="date-time">.')
	}
	render() {
		const datetime = this.datetime.split("T")

		return [datetime[0], " ", datetime[1]]
	}
}
