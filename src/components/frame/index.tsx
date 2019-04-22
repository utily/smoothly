import { Component, Prop, Element, Event, EventEmitter, Method } from "@stencil/core"
import { Trigger } from "../../Trigger"
import { Message } from "../../Message"

@Component({
	tag: "smoothly-frame",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFrame {
	@Prop() url: string
	@Event() trigger: EventEmitter<Trigger>
	@Event() message: EventEmitter<object>
	@Element() element?: HTMLElement
	get contentWindow(): Window | undefined {
		const iframe = this.element && this.element.firstElementChild ? this.element.firstElementChild as HTMLIFrameElement : undefined
		return iframe && iframe.contentWindow || undefined
	}
	componentDidLoad() {
		if (this.contentWindow)
		Message.listen((destination, content) => {
			if (destination == "parent")
				if (Trigger.is(content))
					this.trigger.emit(content)
				else
					this.message.emit({ destination, content })
		}, this.contentWindow)
	}
	send(message: Message<any>): void
	send(destination: string, content: Trigger | any): void
	@Method()
	send(message: string | Message<any>, content?: Trigger | any): void {
		if (typeof(message) == "string")
			Message.send(message, content, this.contentWindow)
		else if (Message.is(message) && this.contentWindow)
			Message.send(message, this.contentWindow)
	}
	render() {
		return <iframe src={ this.url } height="100%" width="100%"></iframe>
	}
}
