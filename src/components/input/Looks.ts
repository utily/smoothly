import { isly } from "isly"

export type Looks = typeof Looks.values[number]

export namespace Looks {
	export const values = ["plain", "grid", "border", "line", "transparent"] as const
	export const type = isly.string(values)
	export const is = type.is
}
