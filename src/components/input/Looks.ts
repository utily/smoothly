import { isly } from "isly"

export type Looks = typeof Looks.types[number]

export namespace Looks {
	export const types = ["plain", "grid", "border", "line", "transparent"] as const
	export const type = isly.string(types)
	export const is = type.is
}
