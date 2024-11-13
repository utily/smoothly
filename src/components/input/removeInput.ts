import { SmoothlyForm } from "../form"
import { Editable } from "./Editable"

export function removeInput(self: { name?: string; parent?: Editable }) {
	if (self.parent instanceof SmoothlyForm && self.name) {
		self.parent.removeInput(self.name)
	}
}
