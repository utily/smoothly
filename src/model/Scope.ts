import { isly } from "isly"

export type Scope = typeof Scope.types[number]

export namespace Scope {
	export const types = [
		"primary",
		"secondary",
		"tertiary",
		"success",
		"warning",
		"danger",
		"light",
		"medium",
		"dark",
	] as const
	export const type = isly.string(types)
	export const is = type.is
}
