import { Component, Element, Event, EventEmitter, h, Prop } from "@stencil/core"
import { Message, Trigger } from "../../model"

@Component({
	tag: "smoothly-0-trigger-source",
	styleUrl: "style.css",
	scoped: true,
})
export class Smoothly0TriggerSource {
	@Prop() listen: string
	@Event() trigger: EventEmitter<Trigger>
	@Event() message: EventEmitter<Message<any>>
	@Element() element?: HTMLElement
	componentDidLoad() {
		Message.listen(
			this.listen,
			(destination, content) => {
				if (Trigger.is(content))
					this.trigger.emit(content)
				else
					this.message.emit({ destination, content })
			},
			window
		)
	}
	render() {
		return <slot></slot>
	}
}
