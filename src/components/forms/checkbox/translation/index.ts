import * as isoly from "isoly"
import * as langly from "langly"
import { sv } from "./sv"

export function create(language: isoly.Language | HTMLElement): langly.Translate {
	return langly.create(
		{
			sv,
		},
		language
	)
}
