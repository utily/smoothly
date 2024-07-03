import { Component, h, Prop } from "@stencil/core"
import { CountryCode, Currency, DateTime, Language, Locale } from "isoly"
import { format, get, Type } from "tidily"

@Component({
	tag: "smoothly-display",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplay {
	@Prop() type: Type
	@Prop() value?: any
	@Prop() currency?: Currency
	@Prop() country?: CountryCode.Alpha2
	@Prop() format?: DateTime.Format
	render() {
		let result: string | HTMLElement | undefined
		const type = this.type
		switch (type) {
			default:
				result = format(this.value, type)
				break
			case "email":
				result = <a href={"mailto:" + this.value}>{format(this.value, type)}</a>
				break
			case "phone":
				result = <a href={"tel:" + this.value}>{format(this.value, type, this.country)}</a>
				break
			case "postal-code":
				result = format(this.value, type, this.country)
				break
			case "price":
				result = format(this.value, type, this.currency)
				break
			case "date":
				result = get(this.type as Type, getLocale())?.toString(this.value)
				break
			case "duration":
				result = format(this.value, type) || "0"
				break
			case "date-time":
				result = this.format
					? DateTime.localize(this.value, this.format, getLocale())
					: get(this.type as Type, getLocale())?.toString(this.value)
				break
		}
		return result
	}
}
function getLocale(): Locale | undefined {
	const result = navigator.language
	return Locale.is(result) ? result : Language.is(result) ? Locale.toLocale(result) : undefined
}
