/**
 * Hsl formated as "hsl(H,S%,L%)" with no spaces included
 * 		with limit: 0 <= H <= 360
 * 		with limit: 0 <= S,L <= 100
 */
export type Hsl = string
export namespace Hsl {
	export function is(value: any | Hsl): value is Hsl {
		const values = typeof value == "string" && value.length > 11 ? value.substring(4, value.length - 1).split(",") : []
		return (
			typeof value == "string" &&
			value.length > 11 &&
			value.substr(0, 4) == "hsl(" &&
			value.substr(value.length - 1, 1) == ")" &&
			values.length == 3 &&
			values.every((single: string, index: number) => {
				let result = false
				if (index == 0)
					result =
						!Number.isNaN(single) &&
						single.match(/[0-9]/g)?.length == single.length &&
						Number(single) >= 0 &&
						Number(single) <= 360
				else {
					const number: string = single.substr(0, single.length - 1)
					result =
						single[single.length - 1] == "%" &&
						!Number.isNaN(number) &&
						number.match(/[0-9]/g)?.length == number.length &&
						Number(number) >= 0 &&
						Number(number) <= 100
				}
				return result
			})
		)
	}
}
