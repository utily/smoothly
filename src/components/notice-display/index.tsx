// tslint:disable-next-line: no-implicit-dependencies
import { Component, Prop, h, Listen } from "@stencil/core"
import { Trigger, Notice } from "smoothly-model"

@Component({
	tag: "smoothly-notice-display",
	styleUrl: "style.css",
	scoped: true,
})
export class NoticeDisplay {
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
			<div>
				<slot></slot>
				<div class={ notice.type }>
					<span>{ notice.message }</span>
					<smoothly-trigger color="dark" fill="clear" name="close"><smoothly-icon name="close-circle" color={ noticeColor }></smoothly-icon></smoothly-trigger>
				</div>
			</div>
	}
}
