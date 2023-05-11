import { Component, Element, Event, EventEmitter, h, Prop } from "@stencil/core"
import { Message, Trigger } from "../../model"

@Component({
	tag: "smoothly-trigger-source",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTriggerSource {
	@Prop() listen: string
	@Event() trigger: EventEmitter<Trigger>
	@Event() msg: EventEmitter<Message<any>>
	@Element() element?: HTMLElement
	componentDidLoad() {
		Message.listen(
			this.listen,
			(destination, content) => {
				if (Trigger.is(content))
					this.trigger.emit(content)
				else
					this.msg.emit({ destination, content })
			},
			window
		)
	}
	render() {
		return <slot></slot>
	}
}
