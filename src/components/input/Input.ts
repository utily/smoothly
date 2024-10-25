import { EventEmitter } from "@stencil/core"
import { isly } from "isly"
import { Color, Data } from "../../model"
import { Editable } from "./Editable"
import { Looks } from "./Looks"

export interface Input extends Input.Element {
	smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	smoothlyInput: EventEmitter<Data>
	smoothlyInputForm?: EventEmitter<Record<string, Data>>
}
export namespace Input {
	export interface Element {
		getValue: GetValue
		color?: Color
		name: string
		invalid?: boolean
		looks?: Looks
		defined?: boolean
		binary?: Binary
		addSelf?: () => Promise<void>
		removeSelf: () => Promise<void>
	}
	export namespace Element {
		export const type = isly.object<Element>({
			getValue: isly.function<GetValue>(),
			color: Color.type.optional(),
			name: isly.string(),
			invalid: isly.boolean().optional(),
			looks: Looks.type,
			defined: isly.boolean().optional(),
			binary: isly.function<Binary>().optional(),
			addSelf: isly.function<() => Promise<void>>().optional(),
			removeSelf: isly.function<() => Promise<void>>(),
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
	})
	export const is = type.is
}
