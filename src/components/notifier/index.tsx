import { Component, h, Host, Listen, Prop, State } from "@stencil/core"
import { Notice } from "../../model"

@Component({
	tag: "smoothly-notifier",
	styleUrl: "style.css",
	scoped: true,
})
export class Notifier {
	@Prop() icon = false
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
		return (
			<Host>
				<slot />
				<div class="smoothly-notifier-wrapper">
					{this.notices.map(n => (
						<smoothly-notification notice={n} icon={this.icon} />
					))}
				</div>
			</Host>
		)
	}
}
