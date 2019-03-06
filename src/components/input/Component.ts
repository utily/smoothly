import * as browser from "./browser"
import { State } from "./State"

export interface Component {
	value: any
	type: string
	minLength: number
	maxLength: number
	autocomplete: browser.Autocomplete
	pattern: RegExp | undefined
	placeholder: string | undefined
}
