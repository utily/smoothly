import { Icon } from "../icon/Icon"
import { Clearable } from "./Clearable"
import { Editable } from "./Editable"
import { Stylable } from "./Stylable"

export interface Input extends Clearable, Editable, Stylable {
	name: string
	value: any
	label?: string
	placement: Placement
	placeholder?: string
	editable: boolean
	clearable: boolean
	layout: Layout
	icon: Icon
	focused: boolean
}

export type Layout = "plain" | "grid" | "border" | "line"
export type Placement = "float" | "start" | "top"

export namespace Input {
	export function placeholder(placement: Placement, value: any, focused: boolean) {
		if (placement == "float")
			if (value || !focused)
				return false
		return true
	}
}
