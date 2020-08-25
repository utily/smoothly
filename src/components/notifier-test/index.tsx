import { Component, h } from "@stencil/core"
import { Notice } from "../../model"

@Component({
	tag: "smoothly-notifier-test",
	styleUrl: "style.css",
	scoped: true,
})
export class NotifierTest {
	private notice: Notice = { type: "warning", message: "This is a warning notice." }

	message: string
	render() {
		return [<smoothly-notifier notice={this.notice}></smoothly-notifier>]
	}
}
