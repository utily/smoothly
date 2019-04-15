import { Component, Listen, Prop } from "@stencil/core"
import { Action } from "../../Action"
import { Message } from "../../Message";

@Component({
	tag: "smoothly-action-sink",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyActionSink {
	@Prop() destination: string
	@Listen("smoothlyAction")
	actionListener(event: CustomEvent<Action>) {
		if (Action.is(event.detail)) {
			Message.send(this.destination, event.detail, window, window.parent.location.origin)
			event.preventDefault()
			event.stopPropagation()
		}
	}
	render() {
		return <slot></slot>
	}
}
