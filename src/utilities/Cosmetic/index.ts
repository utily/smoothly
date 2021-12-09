import { Color as CosmeticColor } from "./Color"

export type Cosmetic = {
	text?: { background?: string; color?: string }
	border?: {
		color?: string
		style?: string
		radius?: string
		width?: string
	}
	gap?: string
	dangerColor?: string
	fontFamily?: string
	background?: string
}

function reduce(types: string[], value: Record<string, string>) {
	return types.reduce(
		(r, c) =>
			typeof value == "object" && value != null && typeof value[c] == "string"
				? {
						...r,
						[c]: value[c],
				  }
				: r,
		{}
	)
}
export namespace Cosmetic {
	export const types = Cosmetic
	export function from(value: any | Cosmetic): Cosmetic {
		let result: Cosmetic = {}
		if (typeof value == "object" && value) {
			result = {
				text: reduce(["background", "color"], value.text),
				border: reduce(["background", "color", "style", "radius", "width"], value.border),
				gap: typeof value.gap == "string" ? value.gap : undefined,
				dangerColor:
					typeof value.dangerColor == "string"
						? value.dangerColor
						: typeof value.danger_color == "string"
						? value.danger_color
						: undefined,
				fontFamily:
					typeof value.fontFamily == "string"
						? value.fontFamily
						: typeof value.font_family == "string"
						? value.font_family
						: undefined,
				background: typeof value.background == "string" ? value.background : undefined,
			}
			Object.keys(result).forEach((key: "text" | "border" | "gap" | "dangerColor" | "fontFamily" | "background") => {
				if (
					result[key] == undefined ||
					(typeof result[key] == "object" && result[key] && Object.keys(result[key] ?? {}).length == 0)
				) {
					delete result[key]
				}
			})
		}
		return result
	}
	export type Color = CosmeticColor
	export const Color = CosmeticColor
}
