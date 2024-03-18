import { isly } from "isly"

export type Color = typeof Color.types[number]

export namespace Color {
	export const types = [
		"default",
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
