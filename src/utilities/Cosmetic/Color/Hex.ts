/**
 * Hex formated as "#xxxxxx" or "#xxx" where x is 0-9, or a-f or A-F
 */
export type Hex = string
export namespace Hex {
	export function is(value: any | Hex): value is Hex {
		const matchArray = (typeof value == "string" && value.match(/[0-9a-fA-F]/g)) || undefined
		return (
			typeof value == "string" &&
			value.length > 3 &&
			value[0] == "#" &&
			(matchArray?.length == 3 || matchArray?.length == 6)
		)
	}
}
