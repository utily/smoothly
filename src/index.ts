import { Color } from "./Color"
import { Components } from "./components"
import { Expand } from "./Expand"
import { Fill } from "./Fill"
import { Message as MessageInterface } from "./Message"
import { Trigger as TriggerInterface } from "./Trigger"

type Message<T> = MessageInterface<T>
type Trigger = TriggerInterface

export {
	Color,
	Components,
	Expand,
	Fill,
	Message,
	Trigger,
}
