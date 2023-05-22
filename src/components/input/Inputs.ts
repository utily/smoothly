import { EventEmitter } from "@stencil/core"
import { Changeable } from "./Changeable"
import { Clearable } from "./Clearable"

export interface Input extends Clearable, Changeable {
	// add Editable to extends
	name: string
	value: any
	smoothlyInput: EventEmitter<Record<string, any>> // Emits on input and willLoad
	smoothlyBlur: EventEmitter
	smoothlyFocus: EventEmitter

	componentWillLoad(): void // Emits smoothlyInput
	onBlur(): void
	onFocus(): void
}
