import { EventEmitter } from "@stencil/core"
import { SmoothlyForm } from "../form"
import { Editable } from "./Editable"

export function removeInputFromForm(self: { name?: string; parent?: Editable }) {
	if (self.parent instanceof SmoothlyForm && self.name) {
		self.parent.removeInput(self.name)
	}
}

export function addInputFromForm(self: {
	smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	parent?: Editable
}) {
	self.smoothlyInputLoad.emit(parent => (self.parent = parent))
}
