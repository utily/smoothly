import * as browser from "./browser"
import { State } from "./State"

export interface Component<T> {
	type: string
	value?: T
	minLength?: number
	maxLength?: number
	required?: boolean
	autocomplete?: browser.Autocomplete
	pattern?: RegExp
	placeholder?: string
}
