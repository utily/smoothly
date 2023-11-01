import { Component, Prop } from "@stencil/core"
import { Currency } from "isoly"

@Component({
	tag: "smoothly-0-display-amount",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayAmount {
	@Prop() amount: number | string
	@Prop() currency: Currency
	@Prop() toInteger = false

	format(amount: string): string {
		const digitsPerGroup = 3
		const defaultDecimals = 2
		const maxDecimals = (
			Currency.decimalDigits(this.currency) ? Currency.decimalDigits(this.currency) : defaultDecimals
		) as number
		let beforeSeparator = amount.length
		let separator: number
		let result = amount
		if (result == "")
			result = "0"
		if (amount.includes(".")) {
			separator = amount.indexOf(".")
			if (separator == 0) {
				result = "0" + result
				separator++
			}
			beforeSeparator = separator
			result = result.padEnd(separator + maxDecimals + 1, "0")
			result = result.substring(0, separator + maxDecimals + 1)
		} else if (!this.toInteger) {
			result = result + "."
			separator = result.length - 1
			result = result.padEnd(separator + maxDecimals + 1, "0")
		}
		const spaces = Math.ceil(beforeSeparator / digitsPerGroup) - 1
		if (spaces > 0) {
			for (let i = 0; i < spaces; i++) {
				const position = beforeSeparator - (spaces - i) * digitsPerGroup
				result = result.slice(0, position) + " " + result.slice(position, result.length)
				beforeSeparator++
			}
		}

		return result
	}

	render() {
		return [
			typeof this.amount == "number" ? this.format(this.amount.toString()) : this.format(this.amount),
			" ",
			this.currency,
		]
	}
}
