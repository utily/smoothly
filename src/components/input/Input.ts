import { EventEmitter } from "@stencil/core"
import { Looks } from "./Looks"

export interface Input {
	name: string
	looks: Looks
	smoothlyInput: EventEmitter<Record<number, any>>
	smoothlyInputLooks: EventEmitter<(looks: Looks) => void>
}
