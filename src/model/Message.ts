export interface Message<T> {
	destination: string
	content: T
}

export namespace Message {
	export function is(value: Message<any> | any): value is Message<any> {
		return typeof value == "object" && typeof value.destination == "string" && value.content != undefined
	}
	export function send(message: Message<any>, context?: Window): void
	export function send(destination: string, content: any, context?: Window): void
	export function send(message: string | Message<any>, content?: any | Window, context?: Window): void {
		if (Message.is(message) && context == undefined) {
			context = content as Window
			if (!context)
				context = window
			const destination = message.destination.split("#", 2)
			message = { destination: destination[1], content: message.content }
			context.postMessage(message, destination[0])
		} else if (typeof context != "string") {
			if (!context)
				context = window
			if (typeof message == "string")
				Message.send({ destination: message, content }, context)
		}
	}
	export function listen(origin: string, handle: (destination: string, content: any) => void, context?: Window): void {
		const splitted = origin.split("#", 2)
		let destination = ""
		if (splitted.length == 2) {
			origin = splitted[0]
			destination = splitted[1]
		}
		;(context || window).addEventListener("message", (e: MessageEvent) => {
			const message = e.data
			if (
				Message.is(message) &&
				(origin == "*" || e.origin == origin) &&
				(destination == "" || message.destination == destination)
			)
				handle(message.destination, message.content)
		})
	}
}
