import { Component, Listen, Prop } from "@stencil/core"
import { Trigger } from "../../Trigger"
import { Message } from "../../Message"

@Component({
	tag: "smoothly-trigger-sink",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTriggerSink {
	@Prop() destination: string
	@Listen("smoothlyTrigger")
	TriggerListener(event: CustomEvent<Trigger>) {
		if (Trigger.is(event.detail)) {
			Message.send(this.destination, event.detail, window, window.parent.location.origin)
			event.preventDefault()
			event.stopPropagation()
		}
	}
	render() {
		return <slot></slot>
	}
}
