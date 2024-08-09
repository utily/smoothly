import { EventEmitter } from "@stencil/core"
import { isly } from "isly"
import { Color, Data } from "../../model"
import { Looks } from "./Looks"
import { Warnings } from "./Warnings"

export interface Input extends Input.Element {
	smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	smoothlyInput: EventEmitter<Data>
	smoothlyInputForm?: EventEmitter<Record<string, Data>>
}
export namespace Input {
	export interface Element {
		value?: Data[string]
		color?: Color
		name: string
		warning?: Warnings.Warning
		looks: Looks
		defined?: boolean
		binary?: Binary
	}
	export namespace Element {
		export const type = isly.object<Element>({
			value: isly.union<Required<Element>["value"], Data, Data[string]>(Data.type, Data.valueType).optional(),
			color: Color.type.optional(),
			name: isly.string(),
			warning: Warnings.Warning.type,
			looks: Looks.type,
			defined: isly.boolean().optional(),
			binary: isly.function<Binary>().optional(),
		})
		export const is = type.is
	}
	export type Binary = () => Promise<boolean>
	const EventEmitter = isly.object<EventEmitter>({ emit: isly.function<EventEmitter["emit"]>() })
	export const type = Element.type.extend<Input>({
		smoothlyInputLoad: EventEmitter,
		smoothlyInput: EventEmitter,
		smoothlyInputForm: EventEmitter.optional(),
	})
	export const is = type.is
}
