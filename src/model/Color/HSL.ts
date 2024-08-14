import { isly } from "isly"
import type { RGB } from "./RGB"

export type HSL = {
	h: number | undefined
	s: number | undefined
	l: number | undefined
}
export namespace HSL {
	export const type = isly.object<HSL>({
		h: isly.number().optional(),
		s: isly.number().optional(),
		l: isly.number().optional(),
	})
	export function toRGB({ h, s, l }: HSL): RGB {
		let r = 0
		let g = 0
		let b = 0
		if (h !== undefined && s !== undefined && l !== undefined) {
			s /= 100
			l /= 100
			const c = (1 - Math.abs(2 * l - 1)) * s
			const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
			const m = l - c / 2
			if (0 <= h && h < 60) {
				r = c
				g = x
				b = 0
			} else if (60 <= h && h < 120) {
				r = x
				g = c
				b = 0
			} else if (120 <= h && h < 180) {
				r = 0
				g = c
				b = x
			} else if (180 <= h && h < 240) {
				r = 0
				g = x
				b = c
			} else if (240 <= h && h < 300) {
				r = x
				g = 0
				b = c
			} else if (300 <= h && h < 360) {
				r = c
				g = 0
				b = x
			}
			r = (r + m) * 255
			g = (g + m) * 255
			b = (b + m) * 255
		}
		return { r, g, b }
	}
}
