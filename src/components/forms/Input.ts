import { Icon } from "../icon/Icon"
import { Clearable } from "./Clearable"
import { Editable } from "./Editable"
import { Stylable } from "./Stylable"

export interface Input extends Clearable, Editable, Stylable {
	name: string
	value?: any
	required: boolean
	placement: Placement
	placeholder?: string
	editable: boolean
	clearable: boolean
	layout: Layout
	icon: Icon
	fill: Colors
	focused: boolean
	label: Colors
	border: Colors
	radius: Radius
	info: string | HTMLElement
}

export type Layout = "plain" | "grid" | "border" | "line"
export type Placement = "float" | "start" | "top" | "outside"
export type Radius = "default" | "rounded" | "circle"
export type Colors =
	| "primary"
	| "secondary"
	| "tertiary"
	| "success"
	| "warning"
	| "danger"
	| "light"
	| "medium"
	| "dark"

export namespace Input {
	export function placeholder(placement: Placement, value: any, focused: boolean) {
		if (placement == "float")
			if (value || !focused)
				return false
		return true
	}

	export function icon(value: any, editable: boolean, clearable: boolean, readonly: boolean, icon?: Icon) {
		let result: Icon | "empty" = icon ?? "empty"
		if (editable && readonly)
			result = "create"
		else if (clearable && value && !readonly)
			result = "close"
		return result
	}

	export function onClickIcon(
		value: any,
		editable: boolean,
		clearable: boolean,
		readonly: boolean,
		inputElement: HTMLElement
	) {
		if (editable && readonly) {
			if (Editable.is(inputElement))
				inputElement.setReadonly(false)
		} else if (clearable && value) {
			if (Clearable.is(inputElement))
				inputElement.clear()
		} else {
			inputElement.click()
		}
	}

	export function is(value: Input | any): value is Input {
		return value && typeof value == "object" && typeof value.name == "string"
	}
}
