import { EventEmitter } from "@stencil/core"
import { isly } from "isly"
import { Color, Data } from "../../model"
import { Looks } from "./Looks"

export interface Input {
	value?: Data[string]
	color?: Color
	name: string
	looks: Looks
	smoothlyInput?: EventEmitter<Data> // These are not found on the object.
	smoothlyInputForm?: EventEmitter<Record<string, Data>>
}
export namespace Input {
	const EventEmitter = isly.object<EventEmitter>({ emit: isly.function<EventEmitter["emit"]>() })
	export const type = isly.object<Input>({
		value: Data.type.optional(),
		color: Color.type.optional(),
		name: isly.string(),
		looks: Looks.type,
		smoothlyInput: EventEmitter.optional(),
		smoothlyInputForm: EventEmitter.optional(),
	})
	export const is = type.is
}
