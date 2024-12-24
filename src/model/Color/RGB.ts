import { isly } from "isly"
import type { Hex } from "./Hex"
import type { HSL } from "./HSL"

export type RGB = {
	r: number | undefined
	g: number | undefined
	b: number | undefined
}
export namespace RGB {
	export const type = isly.object<RGB>({
		r: isly.number().optional(),
		g: isly.number().optional(),
		b: isly.number().optional(),
	})
	export function toHex(rgb: RGB): Hex {
		let hex = ""
		for (const component of Object.values(rgb)) {
			if (component === 0) {
				hex += "00"
			} else if (component && component >= 0 && component <= 255) {
				const temp = Math.round(component).toString(16)
				hex += temp.length === 1 ? "0" + temp : temp
			}
		}
		const hexPairs = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]
		hexPairs.every(pair => pair[0] === pair[1]) && (hex = hexPairs.map(pair => pair[0]).join(""))
		return "#" + hex
	}
	export function toHSL({ r, g, b }: RGB): HSL {
		let h: number | undefined, s: number | undefined, l: number | undefined
		if (r !== undefined && g !== undefined && b !== undefined) {
			r /= 255
			g /= 255
			b /= 255
			const max = Math.max(r, g, b)
			const min = Math.min(r, g, b)
			l = (max + min) / 2
			if (max === min) {
				h = s = 0
			} else {
				const d = max - min
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
				switch (max) {
					case r:
						h = (g - b) / d + (g < b ? 6 : 0)
						break
					case g:
						h = (b - r) / d + 2
						break
					case b:
						h = (r - g) / d + 4
						break
					default:
						h = 0
				}
				h /= 6
			}
			h = h * 360
			s = s * 100
			l = l * 100
		}
		return { h, s, l }
	}
	export function round({ r, g, b }: RGB): RGB {
		return {
			r: r ? Math.round(r) : undefined,
			g: g ? Math.round(g) : undefined,
			b: b ? Math.round(b) : undefined,
		}
	}
}
