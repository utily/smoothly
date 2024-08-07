export type RGB = {
	r: number | undefined
	g: number | undefined
	b: number | undefined
}
export type HSL = {
	h: number | undefined
	s: number | undefined
	l: number | undefined
}
export function hexToRGB(hex: string): RGB {
	console.log("hexToRGB")
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
export function RGBToHex(rgb: RGB): string {
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
export function RGBtoHSL({ r, g, b }: RGB): HSL {
	let h, s, l
	if (r !== undefined && g !== undefined && b !== undefined) {
		r /= 255
		g /= 255
		b /= 255

		const max = Math.max(r, g, b),
			min = Math.min(r, g, b)

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
export function HSLtoRGB({ h, s, l }: HSL): RGB {
	let r = 0,
		g = 0,
		b = 0

	if (h !== undefined && s !== undefined && l !== undefined) {
		s /= 100
		l /= 100

		const c = (1 - Math.abs(2 * l - 1)) * s,
			x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
			m = l - c / 2

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
