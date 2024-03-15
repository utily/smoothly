import { EventEmitter } from "@stencil/core"
import { isly } from "isly"
import { Color, Data } from "../../model"
import { Looks } from "./Looks"

export interface Input {
	value?: Data[string]
	color?: Color
	name: string
	looks: Looks
	smoothlyInput: EventEmitter<Data>
	smoothlyInputForm?: EventEmitter<Record<string, Data>>
}
export namespace Input {
	const EventEmitter = isly.object<EventEmitter>({ emit: isly.function<EventEmitter["emit"]>() })
	export const type = isly.object<Input>({
		color: Color.type,
		name: isly.string(),
		looks: Looks.type,
		value: Data.type,
		smoothlyInput: EventEmitter,
		smoothlyInputForm: EventEmitter,
	})
	export const is = type.is
}
