import { isly } from "isly"
import { Hex as ColorHex } from "./Hex"
import { HSL as ColorHSL } from "./HSL"
import { RGB as ColorRGB } from "./RGB"

export type Color = typeof Color.types[number]

export namespace Color {
	export import Hex = ColorHex
	export import HSL = ColorHSL
	export import RGB = ColorRGB
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