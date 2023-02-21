import { Component, Element, Event, EventEmitter, Method, Prop } from "@stencil/core"
import { Message, Trigger } from "../../model"

@Component({
	tag: "smoothly-frame",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFrame {
	@Prop() url: string
	@Prop() name: string
	@Event() trigger: EventEmitter<Trigger>
	@Event() message2: EventEmitter<Message<any>>
	@Element() element?: HTMLElement
	get contentWindow(): Window | undefined {
		const iframe =
			this.element && this.element.firstElementChild ? (this.element.firstElementChild as HTMLIFrameElement) : undefined
		return (iframe && iframe.contentWindow) || undefined
	}
	@Prop()
	origin: string | undefined

	get defaultOrigin(): string {
		const match = this.url.match(/^(([a-z]+\+)*[a-z]+:\/\/)?[^/^\n]+/)
		return match ? match[0] : "*"
	}
	componentDidLoad() {
		if (this.contentWindow)
			Message.listen(
				this.origin ?? this.defaultOrigin,
				(destination: string, content: any) => {
					if (destination == this.name)
						if (Trigger.is(content))
							this.trigger.emit(content)
						else
							this.message2.emit({ destination, content })
				},
				window
			)
	}
	send(message2: Message<any>): void
	send(destination: string, content: Trigger | any): void
	@Method()
	async send(message2: string | Message<any>, content?: Trigger | any): Promise<void> {
		if (typeof message2 == "string")
			Message.send((this.origin ?? this.defaultOrigin) + "#" + message2, content, this.contentWindow)
		else if (Message.is(message2) && this.contentWindow)
			Message.send(
				{
					destination: (this.origin ?? this.defaultOrigin) + "#" + message2.destination,
					content: message2.destination,
				},
				this.contentWindow
			)
	}

	render() {
		return []
	}
}
