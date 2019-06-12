import * as browser from "./browser"

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
