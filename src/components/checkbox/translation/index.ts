import { isoly } from "isoly"
import { langly } from "langly"
import { sv } from "./sv"

export function create(language: isoly.Language | HTMLElement): langly.Translate {
	return langly.create(
		{
			sv,
		},
		language
	)
}
