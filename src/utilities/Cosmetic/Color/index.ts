import { CommaRgb as ColorCommaRgb } from "./CommaRgb"
import { Hex as ColorHex } from "./Hex"
import { Hsl as ColorHsl } from "./Hsl"
import { Name as ColorName, Names as ColorNames } from "./Name"
import { Rgb as ColorRgb } from "./Rgb"

export type Color = ColorCommaRgb | ColorHex | ColorHsl | ColorName | ColorRgb
export namespace Color {
	export function is(value: any | Color): value is Color {
		return (
			typeof value == "string" &&
			(ColorCommaRgb.is(value) || ColorHex.is(value) || ColorHsl.is(value) || ColorName.is(value) || ColorRgb.is(value))
		)
	}
	export function from(value: any | Color): Color | undefined {
		return is(value) ? value : undefined
	}
	export const Names = ColorNames
	export type Name = ColorName
	export const Name = ColorName
	export type CommaRgb = ColorCommaRgb
	export const CommaRgb = ColorCommaRgb
	export type Rgb = ColorRgb
	export const Rgb = ColorRgb
	export type Hex = ColorHex
	export const Hex = ColorHex
	export type Hsl = ColorHsl
	export const Hsl = ColorHsl
}
