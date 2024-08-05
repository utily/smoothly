export type RGB = {
	r: number | undefined
	g: number | undefined
	b: number | undefined
}
export function hexToRGB(hex: string): RGB {
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
			const temp = component.toString(16)
			hex += temp.length === 1 ? "0" + temp : temp
		}
	}
	const hexPairs = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]
	hexPairs.every(pair => pair[0] === pair[1]) && (hex = hexPairs.map(pair => pair[0]).join(""))
	return "#" + hex
}
