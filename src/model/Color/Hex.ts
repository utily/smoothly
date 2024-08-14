import { isly } from "isly"
import type { RGB } from "./RGB"

export type Hex = string
export namespace Hex {
	export const type = isly.string()
	export function is(value: string): boolean {
		return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)
	}
	export function toRGB(hex: string): RGB {
		hex = hex.replace(/^#/, "")
		if (hex.length === 3) {
			hex = hex
				.split("")
				.map(char => char + char)
				.join("")
		}
		const bigint = parseInt(hex, 16)
		const r = (bigint >> 16) & 255
		const g = (bigint >> 8) & 255
		const b = bigint & 255
		return { r, g, b }
	}
}
