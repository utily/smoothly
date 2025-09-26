import { isoly } from "isoly"

export namespace DateFormat {
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
