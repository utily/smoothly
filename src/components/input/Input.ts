import { EventEmitter } from "@stencil/core"
import { Color, Data } from "../../model"
import { Looks } from "./Looks"

export interface Input {
	value?: Data[string]
	color?: Color
	name: string
	looks: Looks
	smoothlyInput: EventEmitter<Data>
	// TODO: Tove add smoothlyInputForm
}
export namespace Input {
	export function is(value: Input | any): value is Input {
		return value && typeof value == "object" && typeof value.name == "string" // TODO: Tove add a more precise check using isly
	}
}
