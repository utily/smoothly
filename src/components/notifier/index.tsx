import { Component, h, Listen, State } from "@stencil/core"
import { Notice } from "../../model"

@Component({
	tag: "smoothly-0-notifier",
	styleUrl: "style.css",
	scoped: true,
})
export class Notifier {
	@State() notices: Notice[] = []

	@Listen("notice")
	onNotice(event: CustomEvent<Notice>) {
		this.notices = [...this.notices, event.detail]
	}
	@Listen("remove")
	onRemove(event: CustomEvent<Notice>) {
		this.notices = [...this.notices.filter(n => n != event.detail)]
	}
	render() {
		return [
			<slot></slot>,
			<aside>
				{this.notices.map(n => (
					<smoothly-0-notification notice={n}></smoothly-0-notification>
				))}
			</aside>,
		]
	}
}
