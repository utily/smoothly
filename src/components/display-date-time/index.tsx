import { Component, ComponentWillLoad, Prop } from "@stencil/core"
import { isoly } from "isoly"

/**
 * DEPRECATED, use  <smoothly-display type="date-time">
 */
@Component({
	tag: "smoothly-display-date-time",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayDateTime implements ComponentWillLoad {
	@Prop() datetime: isoly.DateTime

	componentWillLoad(): void | Promise<void> {
		console.warn('Component <smoothly-display-date-time> is deprecated, use <smoothly-display type="date-time">.')
	}
	render() {
		const datetime = this.datetime.split("T")

		return [datetime[0], " ", datetime[1]]
	}
}
