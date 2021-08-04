import { colorNames } from "./colorNames"
export function toCommaRgb(color: string): string | undefined {
	let result: string | undefined
	const colorWithoutSpace = color.replace(/ /g, "").toLowerCase()

	if (isCommaRgb(colorWithoutSpace))
		result = colorWithoutSpace
	else if (isHex(colorWithoutSpace))
		result = hexToCommaRgb(colorWithoutSpace)
	else if (isRgb(colorWithoutSpace))
		result = rgbToCommaRgb(colorWithoutSpace)
	else if (colorWithoutSpace in colorNames)
		result = hexToCommaRgb(colorNames[colorWithoutSpace])
	else if (isHsl(colorWithoutSpace))
		result = hslToCommaRgb(colorWithoutSpace)

	return result
}

export function isCommaRgb(commaRgb: string): boolean {
	const values = commaRgb.split(",")
	return (
		values.length == 3 &&
		values.every(
			value =>
				!Number.isNaN(value) &&
				value.match(/[0-9]/g)?.length == value.length &&
				Number(value) >= 0 &&
				Number(value) <= 255
		)
	)
}

/**
 * @param hex formated as "#xxxxxx" or "#xxx" where x is 0-9, or a-f or A-F
 */
export function isHex(hex: string): boolean {
	const matchArray = hex.match(/[0-9a-fA-F]/g)
	return hex[0] == "#" && (matchArray?.length == 3 || matchArray?.length == 6)
}
export function hexToCommaRgb(hex: string): string {
	let result = "0,0,0"
	if (hex.length == 7)
		result = `${parseInt(hex.substr(1, 2), 16)},${parseInt(hex.substr(3, 2), 16)},${parseInt(hex.substr(5, 2), 16)}`
	else if (hex.length == 4)
		result = hexToCommaRgb(`#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`)
	return result
}

/**
 * @param rgb formated as "rgb(r,g,b)", with no spaces included
 */
export function isRgb(rgb: string): boolean {
	const values = rgb.substring(4, rgb.length - 1).split(",")
	return (
		rgb.substr(0, 4) == "rgb(" &&
		rgb.substr(rgb.length - 1, 1) == ")" &&
		values.length == 3 &&
		values.every(
			value =>
				!Number.isNaN(value) &&
				value.match(/[0-9]/g)?.length == value.length &&
				Number(value) >= 0 &&
				Number(value) <= 255
		)
	)
}
export function rgbToCommaRgb(rgb: string): string {
	return rgb.substring(4, rgb.length - 1)
}
/**
 *
 * @param hsl formated as "hsl(H,S%,L%)" with no spaces included
 * 		with limit: 0 <= H <= 360
 * 		with limit: 0 <= S,L <= 100
 */
export function isHsl(hsl: string): boolean {
	const values = hsl.substring(4, hsl.length - 1).split(",")
	return (
		hsl.substr(0, 4) == "hsl(" &&
		hsl.substr(hsl.length - 1, 1) == ")" &&
		values.length == 3 &&
		values.every((value, index) => {
			let result = false
			if (index == 0)
				result =
					!Number.isNaN(value) &&
					value.match(/[0-9]/g)?.length == value.length &&
					Number(value) >= 0 &&
					Number(value) <= 360
			else {
				const number: string = value.substr(0, value.length - 1)
				result =
					value[value.length - 1] == "%" &&
					!Number.isNaN(number) &&
					number.match(/[0-9]/g)?.length == number.length &&
					Number(number) >= 0 &&
					Number(number) <= 100
			}
			return result
		})
	)
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
export function hslToCommaRgb(hsl: string): string | undefined {
	let result: string | undefined
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
