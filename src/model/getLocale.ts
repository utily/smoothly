import { isoly } from "isoly"

export function getLocale(): isoly.Locale | undefined {
	const result = navigator.language
	return isoly.Locale.is(result) ? result : isoly.Language.is(result) ? isoly.Locale.toLocale(result) : undefined
}
