import { EventEmitter } from "@stencil/core"
import { isly } from "isly"
import { Color, Data } from "../../model"
import { SmoothlyForm } from "../form"
import { Editable } from "./Editable"
import { Key } from "./Key"
import { Looks } from "./Looks"

export interface Input extends Input.Element {
	smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	smoothlyInput: EventEmitter<Data> // Used for smoothly-form
	smoothlyUserInput?: EventEmitter<Input.UserInput> // Make required
	smoothlyKeydown?: EventEmitter<Key>
	smoothlyInputForm?: EventEmitter<Record<string, Data>>
	parent: Editable | undefined
}
export namespace Input {
	export type UserInput = { name: string; value: any }
	export interface Element {
		register: () => Promise<void>
		unregister: () => Promise<void>
		getValue: GetValue
		disabled?: boolean
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
			disabled: isly.boolean().optional(),
			color: Color.type.optional(),
			name: isly.string(),
			invalid: isly.boolean().optional(),
			looks: Looks.type.optional(),
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
		smoothlyUserInput: EventEmitter,
		smoothlyKeydown: EventEmitter.optional(),
		smoothlyInputForm: EventEmitter.optional(),
		parent: Editable.type.optional(),
	})
	export const is = type.is

	export function formRemove(self: Input, name?: string) {
		if (self.parent instanceof SmoothlyForm)
			self.parent.removeInput(name ?? self.name)
	}
	export function formAdd(self: Input) {
		self.smoothlyInputLoad.emit(parent => (self.parent = parent))
	}
	export function formRename(self: Input, oldName?: string) {
		if (oldName)
			formRemove(self, oldName)
		formAdd(self)
	}

	/* For adding clear, edit, reset that is inside input etc. - should be called on smoothlyInputLoad */
	export function registerSubAction(self: Input & Editable, event: CustomEvent<(parent: Editable) => void>) {
		if (!(event.target && "name" in event.target && event.target.name === self.name)) {
			event.stopPropagation()
			event.detail(self)
		}
	}
}
