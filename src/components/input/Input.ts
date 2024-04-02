import { EventEmitter } from "@stencil/core"
import { isly } from "isly"
import { Color, Data } from "../../model"
import { Looks } from "./Looks"

export interface Input extends Input.Element {
	smoothlyInput: EventEmitter<Data>
	smoothlyInputForm?: EventEmitter<Record<string, Data>>
}
export namespace Input {
	export interface Element {
		value?: Data[string]
		color?: Color
		name: string
		looks: Looks
	}
	export namespace Element {
		export const type = isly.object<Element>({
			value: isly.union<Required<Element>["value"], Data, Data[string]>(Data.type, Data.valueType).optional(),
			color: Color.type.optional(),
			name: isly.string(),
			looks: Looks.type,
		})
		export const is = type.is
	}
	const EventEmitter = isly.object<EventEmitter>({ emit: isly.function<EventEmitter["emit"]>() })
	export const type = Element.type.extend<Input>({
		smoothlyInput: EventEmitter,
		smoothlyInputForm: EventEmitter.optional(),
	})
	export const is = type.is
}
