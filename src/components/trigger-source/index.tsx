import { Component, Element, Event, EventEmitter, Prop } from "@stencil/core"
import { Trigger } from "../../Trigger"
import { Message } from "../../Message"

@Component({
	tag: "smoothly-trigger-source",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTriggerSource {
	@Prop() name: string
	@Event() trigger: EventEmitter<Trigger>
	@Event() message: EventEmitter<Message<any>>
	@Element() element?: HTMLElement
	componentDidLoad() {
		Message.listen((destination, content) => {
			if (destination == this.name)
				if (Trigger.is(content))
					this.trigger.emit(content)
				else
					this.message.emit({ destination, content })
		})
	}
	render() {
		return <slot></slot>
	}
}
