import { Component, Element, Event, EventEmitter, Prop, h } from "@stencil/core"
import { Message, Trigger } from "smoothly-model"

@Component({
	tag: "smoothly-trigger-source",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTriggerSource {
	@Prop() listen: string
	@Event() trigger: EventEmitter<Trigger>
	@Event() message: EventEmitter<Message<any>>
	@Element() element?: HTMLElement
	componentDidLoad() {
		Message.listen(this.listen, (destination, content) => {
			console.log("trigger-source listen", destination, content, Trigger.is(content))
			if (Trigger.is(content))
				this.trigger.emit(content)
			else
				this.message.emit({ destination, content })
		}, window)
	}
	render() {
		return <slot></slot>
	}
}
