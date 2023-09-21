import { EventEmitter } from "@stencil/core"
import { Color } from "../../model"
import { Looks } from "./Looks"

export interface Input {
	color?: Color
	name: string
	looks: Looks
	smoothlyInput: EventEmitter<Record<number, any>>
	smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color | undefined) => void>
}
