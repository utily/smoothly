export interface Message<T> {
	destination: string
	content: T
}
export class Message<T> {
	static is(value: Message<any> | any): value is Message<any> {
		return typeof(value) == "object" &&
			typeof(value.destination) == "string"
	}
	static send(message: Message<any>, context?: Window, origin?: string): void
	static send(destination: string, content: any, context?: Window, origin?: string): void
	static send(message: string | Message<any>, content?: any | Window, context?: Window | string, origin?: string): void {
		if (Message.is(message) && (typeof(context) == "string" || context == undefined) && origin == undefined) {
			origin = context
			context = content as Window
			if (!context)
				context = window
			if (!origin)
				origin = context.location.origin
			content.postMessage(message, context)
		} else if (typeof(context) != "string") {
			if (!context)
				context = window
			if (!origin)
				origin = context.location.origin
			if (typeof(message) == "string")
			Message.send({ destination: message, content }, context, origin)
		}
	}
	static listen(handle: (destination: string, content: any) => void, context?: Window, origin?: string): void {
		(context || window).addEventListener("message", (e: MessageEvent) => {
			const message = e.data
			if (!origin)
				origin = (context || window).location.origin
			if (Message.is(message) && (origin == "*" || e.origin == origin))
				handle(message.destination, message.content)
		})
	}
}
