// tslint:disable-next-line: no-implicit-dependencies
import { Component, Listen, Prop, Watch, h } from "@stencil/core"
import { Trigger, Notice } from "smoothly-model"

@Component({
	tag: "smoothly-notifier",
	styleUrl: "style.css",
	scoped: true,
})
export class Notifier {
	private timer: number
	@Prop() notice?: string | Notice
	@Listen("trigger")
	onTrigger(event: CustomEvent<Trigger>) {
		if (event.detail.name == "close") {
			event.stopPropagation()
			this.notice = undefined
		}
	}
	@Watch("notice")
	onUpdatedNotice(newValue: string | Notice) {
		if (newValue != undefined)
			this.timer = window.setInterval(() => { this.notice = undefined }, 5000)
		else
			window.clearInterval(this.timer)
	}
	@Listen("notice")
	onNotice(event: CustomEvent<Notice>) {
		this.notice = event.detail
	}
	render() {
		const notice = !this.notice ? undefined : typeof(this.notice) == "string" ? JSON.parse(this.notice) as Notice : this.notice
		const color = notice && notice.type != "default" ? notice.type : "primary"
		return notice == undefined ? <slot></slot> :
		[
			<slot></slot>,
			<aside class={ notice.type }>
				<p>{ notice.message }<smoothly-trigger color="dark" fill="clear" name="close"><smoothly-icon name="close-circle" color={ color }></smoothly-icon></smoothly-trigger></p>
			</aside>,
		]
	}
}
