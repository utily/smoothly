import { Component, h, Prop } from "@stencil/core"
import { isoly } from "isoly"
import { tidily } from "tidily"
import { getLocale } from "../../model"

@Component({
	tag: "smoothly-display",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplay {
	@Prop() type: tidily.Type | "json"
	@Prop() label?: string
	@Prop() value?: any
	@Prop() collapseDepth?: number
	@Prop() toInteger?: boolean
	@Prop() currency?: isoly.Currency
	@Prop() country?: isoly.CountryCode.Alpha2
	@Prop() format?: isoly.DateTime.Format
	render() {
		let result: string | HTMLElement | undefined
		const type = this.type
		switch (type) {
			case "json":
				result = <smoothly-display-json value={this.value} collapseDepth={this.collapseDepth} />
				break
			default:
				result = tidily.format(this.value, type)
				break
			case "email":
				result = <a href={"mailto:" + this.value}>{tidily.format(this.value, type)}</a>
				break
			case "phone":
				result = <a href={"tel:" + this.value}>{tidily.format(this.value, type, this.country)}</a>
				break
			case "postal-code":
				result = tidily.format(this.value, type, this.country)
				break
			case "price":
				result = tidily.format(this.value, type, { currency: this.currency, toInteger: this.toInteger })
				break
			case "date":
				result = tidily.get(this.type as tidily.Type, getLocale())?.toString(this.value)
				break
			case "duration":
				result = tidily.format(this.value, type) || "0"
				break
			case "date-time":
				result = this.format
					? isoly.DateTime.localize(this.value, this.format, getLocale())
					: tidily.get(this.type as tidily.Type, getLocale())?.toString(this.value)
				break
		}
		return this.label ? [<div>{this.label}</div>, result] : result
	}
}
