import { Hex } from "./Hex"
import { Hsl } from "./Hsl"
import { Name as ColorName, Names } from "./Name"
import { Rgb } from "./Rgb"

/**
 * Formated as "r,g,b", with no spaces included
 */
export type CommaRgb = string
export namespace CommaRgb {
	export function is(value: any | CommaRgb): value is CommaRgb {
		const values = typeof value == "string" ? value.split(",") : []
		return (
			values.length == 3 &&
			values.every(
				(value: string) =>
					!Number.isNaN(value) &&
					value.match(/[0-9]/g)?.length == value.length &&
					Number(value) >= 0 &&
					Number(value) <= 255
			)
		)
	}
	export function from(color: any): CommaRgb | undefined {
		let result: CommaRgb | undefined
		const colorWithoutSpace: CommaRgb | undefined =
			typeof color == "string" ? color.replace(/ /g, "").toLowerCase() : undefined
		if (!colorWithoutSpace)
			result = undefined
		else if (CommaRgb.is(colorWithoutSpace))
			result = colorWithoutSpace
		else if (Hex.is(colorWithoutSpace))
			result = fromHex(colorWithoutSpace)
		else if (Rgb.is(colorWithoutSpace))
			result = fromRgb(colorWithoutSpace)
		else if (ColorName.is(colorWithoutSpace))
			result = fromHex(Names[colorWithoutSpace])
		else if (Hsl.is(colorWithoutSpace))
			result = fromHsl(colorWithoutSpace)
		return result
	}
	export function fromHex(hex: Hex): CommaRgb {
		let result: CommaRgb = "0,0,0"
		if (hex.length == 7)
			result = `${parseInt(hex.substr(1, 2), 16)},${parseInt(hex.substr(3, 2), 16)},${parseInt(hex.substr(5, 2), 16)}`
		else if (hex.length == 4)
			result = fromHex(`#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`)
		return result
	}
	export function fromRgb(rgb: Rgb): CommaRgb {
		return rgb.substring(4, rgb.length - 1)
	}
	export function fromHsl(hsl: Hsl): CommaRgb {
		let result: CommaRgb = ""
		let h, s, l: number
		let r, g, b: number
		const HSL: number[] = hsl
			.substring(4, hsl.length - 1)
			.split(",")
			.map((value, index) => Number(index == 0 ? value : value.substr(0, value.length - 1)))
		if (HSL.length == 3) {
			h = HSL[0] / 360
			s = HSL[1] / 100
			l = HSL[2] / 100
			if (s == 0)
				r = g = b = l
			else {
				const q = l < 0.5 ? l * (1 + s) : l + s - l * s
				const p = 2 * l - q
				r = hue2rgb(p, q, h + 1 / 3)
				g = hue2rgb(p, q, h)
				b = hue2rgb(p, q, h - 1 / 3)
			}
			result = `${Math.round(255 * r)},${Math.round(255 * g)},${Math.round(255 * b)}`
		}
		return result
	}
	function hue2rgb(p: number, q: number, t: number): number {
		let result = p
		if (t < 0)
			t += 1
		if (t > 1)
			t -= 1
		if (t < 1 / 6)
			result = p + (q - p) * 6 * t
		else if (t < 1 / 2)
			result = q
		else if (t < 2 / 3)
			result = p + (q - p) * (2 / 3 - t) * 6
		return result
	}
}
