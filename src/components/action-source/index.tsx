import { Component, Element, Event, EventEmitter, Listen, Prop } from "@stencil/core"
import { Action } from "../../Action"
import { Message } from "../../Message"

@Component({
	tag: "smoothly-action-source",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyActionSource {
	@Prop() name: string
	@Event() smoothlyAction: EventEmitter<Action>
	@Event() smoothlyMessage: EventEmitter<Message<any>>
	@Element() element?: HTMLElement
	componentDidLoad() {
		Message.listen((destination, content) => {
			if (destination == this.name)
				if (Action.is(content))
					this.smoothlyAction.emit(content)
				else
					this.smoothlyMessage.emit({ destination, content })
		})
	}
	render() {
		return <slot></slot>
	}
}
