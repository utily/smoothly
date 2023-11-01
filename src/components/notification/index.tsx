// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from "@stencil/core"
import { Color, Notice, Trigger } from "../../model"

@Component({
	tag: "smoothly-0-notification",
	styleUrl: "style.css",
	scoped: true,
})
export class Notification {
	@Prop() notice: Notice
	@State() tick = {}
	@Event() remove: EventEmitter<Notice>
	private listener: Notice.Listener = notice => {
		console.log("changed: ", notice)
		if (notice.state == "closed")
			this.remove.emit(notice)
		else
			this.tick = {}
	}
	private get color(): Color {
		let result: Color
		switch (this.notice.state) {
			case "delayed":
			case "warning":
				result = "warning"
				break
			case "success":
				result = "success"
				break
			case "executing":
				result = "light"
				break
			case "failed":
				result = "danger"
				break
			default:
				result = "light"
				break
		}
		return result
	}
	@Listen("trigger")
	onTrigger(event: CustomEvent<Trigger>) {
		if (event.detail.name == "close") {
			event.stopPropagation()
			this.notice.close()
		}
	}

	@Watch("notice")
	onUpdatedNotice(newValue: Notice, oldValue?: Notice) {
		if (oldValue)
			oldValue.unlisten(this.listener)
		newValue.listen(this.listener)
	}
	componentDidLoad() {
		this.onUpdatedNotice(this.notice)
	}

	render() {
		return (
			<Host color={this.color} fill="solid">
				<smoothly-0-trigger fill="clear" name="close">
					<smoothly-0-icon name="close-circle-outline"></smoothly-0-icon>
				</smoothly-0-trigger>
				<p>{this.notice.message}</p>
			</Host>
		)
	}
}
