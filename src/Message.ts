export interface Message<T> {
	destination: string
	content: T
}
export class Message<T> {
	static is(value: Message<any> | any): value is Message<any> {
		return typeof(value) == "object" &&
			typeof(value.destination) == "string" &&
			value.content != undefined
	}
	static send(message: Message<any>, context?: Window): void
	static send(destination: string, content: any, context?: Window): void
	static send(message: string | Message<any>, content?: any | Window, context?: Window): void {
		console.log("message.send", { message, content, context })
		if (Message.is(message) && context == undefined) {
			context = content as Window
			if (!context)
				context = window
			const destination = message.destination.split("#", 2)
			message = { destination: destination[1], content: message.content }
			console.log("postMessage", message, destination[0])
			context.postMessage(message, destination[0])
		} else if (typeof(context) != "string") {
			if (!context)
				context = window
			if (typeof(message) == "string")
			Message.send({ destination: message, content }, context)
		}
	}
	static listen(origin: string, handle: (destination: string, content: any) => void, context?: Window): void {
		const splitted = origin.split("#", 2)
		let destination = ""
		if (splitted.length == 2) {
			origin = splitted[0]
			destination = splitted[1]
		}
		(context || window).addEventListener("message", (e: MessageEvent) => {
			console.log("message.listen callback", origin, { message: e.data, origin: e.origin })
			const message = e.data
			if (Message.is(message) && (origin == "*" || e.origin == origin) && (destination == "" || message.destination == destination))
				handle(message.destination, message.content)
		})
	}
}
