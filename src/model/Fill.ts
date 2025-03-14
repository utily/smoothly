import { isly } from "isly"

export type Fill = typeof Fill.values[number]

export namespace Fill {
	export const values = ["clear", "default", "outline", "solid"] as const
	export const type = isly.string(values)
}
