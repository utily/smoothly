/**
 * Formated as "rgb(r,g,b)", with no spaces included
 */
export type Rgb = string
export namespace Rgb {
	export function is(value: any | Rgb): value is Rgb {
		const values = typeof value == "string" && value.length > 9 ? value.substring(4, value.length - 1).split(",") : []
		return (
			typeof value == "string" &&
			value.length > 9 &&
			value.substr(0, 4) == "rgb(" &&
			value.substr(value.length - 1, 1) == ")" &&
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
}
