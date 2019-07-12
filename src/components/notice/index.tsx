// tslint:disable-next-line: no-implicit-dependencies
import { Component, Prop, h, Listen } from "@stencil/core"
import { Trigger, Notice } from "smoothly-model"

@Component({
	tag: "smoothly-notice",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNotice {
	@Prop() notice: string | Notice = { type: "warning", message: "An error occured."}
	@Prop({ mutable: true }) show: boolean = false
	@Listen("trigger")
	onTrigger(event: CustomEvent<Trigger>) {
		this.show = false
	}
	@Listen("notice")
	onNotice(event: CustomEvent<Notice>) {
		this.notice = event.detail
		this.show = true
	}
	render() {
		const notice = typeof(this.notice) == "string" ? JSON.parse(this.notice) as Notice : this.notice
		const noticeColor = notice.type != "default" ? notice.type : "primary"
		return !this.show ? <slot></slot> :
		[
			<slot></slot>,
			<aside class={ notice.type }>
				<p>{ notice.message }<smoothly-trigger color="dark" fill="clear" name="close"><smoothly-icon name="close-circle" color={ noticeColor }></smoothly-icon></smoothly-trigger></p>
			</aside>,
		]
	}
}
