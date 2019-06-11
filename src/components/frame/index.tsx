import { Component, Prop, Element, Event, EventEmitter, Method, h } from "@stencil/core"
import { Trigger } from "../../Trigger"
import { Message } from "../../Message"

@Component({
	tag: "smoothly-frame",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFrame {
	@Prop() url: string
	@Prop() name: string
	@Event() trigger: EventEmitter<Trigger>
	@Event() message: EventEmitter<object>
	@Element() element?: HTMLElement
	get contentWindow(): Window | undefined {
		const iframe = this.element && this.element.firstElementChild ? this.element.firstElementChild as HTMLIFrameElement : undefined
		return iframe && iframe.contentWindow || undefined
	}
	get urlOrigin(): string {
		const match = this.url.match(/^(([a-z]+\+)*[a-z]+:\/\/)?[^\/^\n]+/)
		return match ? match[0] : "*"
	}
	componentDidLoad() {
		if (this.contentWindow)
		Message.listen("*" /*this.urlOrigin*/, (destination: string, content: any) => {
			console.log("frame.listen", destination, content)
			if (destination == this.name)
				if (Trigger.is(content))
					this.trigger.emit(content)
				else
					this.message.emit({ destination, content })
		}, window)
	}
	send(message: Message<any>): void
	send(destination: string, content: Trigger | any): void
	@Method()
	async send(message: string | Message<any>, content?: Trigger | any): Promise<void> {
		console.log("frame.submit", message, content, this.urlOrigin)
		if (typeof(message) == "string")
			Message.send(this.urlOrigin + "#" + message, content, this.contentWindow)
		else if (Message.is(message) && this.contentWindow)
			Message.send({ destination: this.urlOrigin + "#" + message.destination, content: message.destination }, this.contentWindow)
	}
	render() {
		return <iframe src={ this.url + "#" + window.location.origin } height="100%" width="100%"></iframe>
	}
}
