// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from "@stencil/core"
import { Color, Notice, Trigger } from "../../model"
import { Icon } from "../../model"

@Component({
	tag: "smoothly-notification",
	styleUrl: "style.css",
	scoped: true,
})
export class Notification {
	@Prop() notice: Notice
	@Prop() closable = true
	@Prop() icon: boolean
	@State() tick = {}
	@Event() remove: EventEmitter<Notice>
	private listener: Notice.Listener = notice => {
		if (notice.state == "closed")
			this.remove.emit(notice)
		else
			this.tick = {}
	}
	private get properties(): [Color, Icon | undefined] {
		let result: [Color, Icon | undefined]
		switch (this.notice.state) {
			case "delayed":
			case "warning":
				result = ["warning", "warning-outline"]
				break
			case "success":
				result = ["success", "checkmark-circle"]
				break
			case "executing":
				result = ["light", "hourglass-outline"]
				break
			case "failed":
				result = ["danger", "alert-circle"]
				break
			default:
				result = ["light", undefined]
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
			<Host color={this.properties[0]} fill="solid">
				{this.closable && (
					<smoothly-trigger fill="clear" name="close">
						<smoothly-icon name="close-circle-outline" />
					</smoothly-trigger>
				)}
				<span class={this.icon ? "icon" : "clean"}>
					{this.icon && <smoothly-icon name={this.properties[1]} />}
					<p>{this.notice.message}</p>
				</span>
			</Host>
		)
	}
}
