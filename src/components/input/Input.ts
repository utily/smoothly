import { EventEmitter } from "@stencil/core"
import { isly } from "isly"
import { Color, Data } from "../../model"
import { SmoothlyForm } from "../form"
import { Editable } from "./Editable"
import { Looks } from "./Looks"

export interface Input extends Input.Element {
	smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	smoothlyInput: EventEmitter<Data>
	smoothlyInputForm?: EventEmitter<Record<string, Data>>
	parent: Editable | undefined
}
export namespace Input {
	export interface Element {
		register: () => Promise<void>
		unregister: () => Promise<void>
		getValue: GetValue
		color?: Color
		name: string
		invalid?: boolean
		looks?: Looks
		defined?: boolean
		binary?: Binary
	}
	export namespace Element {
		export const type = isly.object<Element>({
			register: isly.function<() => Promise<void>>(),
			unregister: isly.function<() => Promise<void>>(),
			getValue: isly.function<GetValue>(),
			color: Color.type.optional(),
			name: isly.string(),
			invalid: isly.boolean().optional(),
			looks: Looks.type,
			defined: isly.boolean().optional(),
			binary: isly.function<Binary>().optional(),
		})
		export const is = type.is
	}
	export type GetValue = () => Promise<any>
	export type Binary = () => Promise<boolean>
	const EventEmitter = isly.object<EventEmitter>({ emit: isly.function<EventEmitter["emit"]>() })
	export const type = Element.type.extend<Input>({
		smoothlyInputLoad: EventEmitter,
		smoothlyInput: EventEmitter,
		smoothlyInputForm: EventEmitter.optional(),
		parent: Editable.type.optional(),
	})
	export const is = type.is

	export function formRemove(self: Input) {
		if (self.parent instanceof SmoothlyForm) {
			self.parent.removeInput(self.name)
		}
	}
	export function formAdd(self: Input) {
		self.smoothlyInputLoad.emit(parent => (self.parent = parent))
	}
	/* For adding clear, edit, reset that is inside input etc. - should be called on smoothlyInputLoad */
	export function registerSubAction(self: Input & Editable, event: CustomEvent<(parent: Editable) => void>) {
		if (!(event.target && "name" in event.target && event.target.name === self.name)) {
			event.stopPropagation()
			event.detail(self)
		}
	}
}
