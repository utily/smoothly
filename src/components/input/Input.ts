import { EventEmitter } from "@stencil/core"
import { isly } from "isly"
import { Color, Data } from "../../model"
import { Looks } from "./Looks"

export interface InputElement {
	value?: Data[string]
	color?: Color
	name: string
	looks: Looks
}
export namespace InputElement {
	export const type = isly.object<InputElement>({
		value: Data.type.optional(),
		color: Color.type.optional(),
		name: isly.string(),
		looks: Looks.type,
	})
	export const is = type.is
}

export interface Input extends InputElement {
	smoothlyInput: EventEmitter<Data>
	smoothlyInputForm?: EventEmitter<Record<string, Data>>
}
export namespace Input {
	const EventEmitter = isly.object<EventEmitter>({ emit: isly.function<EventEmitter["emit"]>() })
	export const type = isly.object<Input>({
		value: Data.type.optional(),
		color: Color.type.optional(),
		name: isly.string(),
		looks: Looks.type,
		smoothlyInput: EventEmitter,
		smoothlyInputForm: EventEmitter.optional(),
	})
	export const is = type.is
}
