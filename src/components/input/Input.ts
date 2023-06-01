import { Icon } from "../icon/Icon"
import { Clearable } from "./Clearable"
import { Editable } from "./Editable"

export interface Input extends Clearable, Editable {
	name: string
	value: any
	label?: string
	position: "float" | "start" | "top"
	placeholder?: string
	editable: boolean
	clearable: boolean
	border: "plain" | "grid" | "border" | "line"
	icon: Icon
	focus: boolean
	lagacy: boolean
}
