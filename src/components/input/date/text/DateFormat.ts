import { isoly } from "isoly"

export namespace DateFormat {
	export const guides = {
		Y: "YYYY",
		M: "MM",
		D: "DD",
	} as const

	export type Part = "Y" | "M" | "D"
	export type Parts = { [part in Part]?: string }
	export namespace Part {
		export function lengthOf(part: Part): number {
			return guides[part].length
		}
		export function getGuide(part: Part, filledLength: number | undefined): string {
			const guide = DateFormat.guides[part]
			return guide.substring(0, guide.length - (filledLength ?? 0))
		}
	}
	export namespace Parts {
		export function lastDay(parts: Parts): number {
			if (parts.Y && parts.M && parseInt(parts.M) >= 1 && parseInt(parts.M) <= 12) {
				const lastDate = isoly.Date.lastOfMonth(`${parts.Y.padStart(4, "0")}-${parts.M.padStart(2, "0")}-01`)
				return isoly.Date.getDay(lastDate)
			} else if (parts.M && parseInt(parts.M) >= 1 && parseInt(parts.M) <= 12) {
				// Assume leap year
				const lastDate = isoly.Date.lastOfMonth(`2004-${parts.M.padStart(2, "0")}-01`)
				return isoly.Date.getDay(lastDate)
			}
			return 31
		}
		export function toDate(parts: Parts): isoly.Date | undefined {
			if (parts.Y && parts.Y.length == 4 && parts.M && parts.M.length == 2 && parts.D && parts.D.length == 2) {
				const value = `${parts.Y}-${parts.M}-${parts.D}`
				const lastOfMonth = isoly.Date.lastOfMonth(`${parts.Y}-${parts.M}-01`)
				return lastOfMonth < value ? lastOfMonth : value
			}
			return undefined
		}
		export function fromDate(value: isoly.Date): Required<DateFormat.Parts>
		export function fromDate(value: undefined): undefined
		export function fromDate(value: isoly.Date | undefined): Required<DateFormat.Parts> | undefined
		export function fromDate(value: isoly.Date | undefined): Required<DateFormat.Parts> | undefined {
			if (value) {
				return {
					Y: value.substring(0, 4).padStart(4, "0"),
					M: value.substring(5, 7).padStart(2, "0"),
					D: value.substring(8, 10).padStart(2, "0"),
				}
			}
			return undefined
		}
	}

	export type Order = "YMD" | "DMY" | "MDY"

	export namespace Order {
		export function fromLocale(locale: isoly.Locale): Order {
			switch (locale) {
				case "en-US":
					return "MDY"
				case "sq-AL":
				case "es-AR":
				case "it-IT":
				case "en-GB":
				case "fr-FR":
				case "et-EE":
				case "de-AT":
				case "de-DE":
				case "he-IL":
				case "is-IS":
				case "lv-LV":
				case "pl-PL":
				case "ru-RU":
				case "fi-FI":
				case "hi-IN":
				case "en-IN":
					return "DMY"
				default:
					return "YMD"
			}
		}
		export function getPart(order: Order, index: number): Part {
			return order.charAt(index) as Part
		}
		export function toArray(order: Order): Part[] {
			return order.split("") as Part[]
		}
	}

	export type Separator = "-" | "/" | "."
	export namespace Separator {
		export function fromLocale(locale: isoly.Locale): Separator {
			switch (locale) {
				case "sq-AL":
				case "es-AR":
				case "it-IT":
				case "en-GB":
				case "fr-FR":
				case "en-US":
					return "/"
				case "et-EE":
				case "de-AT":
				case "de-DE":
				case "he-IL":
				case "is-IS":
				case "lv-LV":
				case "pl-PL":
				case "ru-RU":
				case "fi-FI":
					return "."
				default:
					return "-"
			}
		}
	}
}
