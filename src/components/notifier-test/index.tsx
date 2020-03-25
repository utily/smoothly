// tslint:disable-next-line: no-implicit-dependencies
import { Component, h } from "@stencil/core"
import { Notice } from "smoothly-model"

@Component({
	tag: "smoothly-notifier-test",
	styleUrl: "style.css",
	scoped: true,
})
export class NotifierTest {
	private notice: Notice = { type: "success", message: "This is a success notice." }

	message: string
	render() {
		return [
			<smoothly-notifier notice={ this.notice }></smoothly-notifier>
		]
	}
}
