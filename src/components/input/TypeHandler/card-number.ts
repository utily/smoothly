import { Base } from "./Base"
import { Component } from "../Component"
import { CardIssuer } from "./CardIssuer"
import { TypeHandler } from "./TypeHandler"

class CardNumber extends Base {
	get native(): Component<string> {
		const result = super.native
		return {
			...result,
			type: "text",
			autocomplete: "cc-number",
			minLength: this.issuer.length,
			maxLength: this.maxLength,
			pattern: this.issuer.verification,
		}
	}
	private get maxLength() { return this.issuer.length + Math.trunc(this.issuer.length / 4) }
	private issuer: CardIssuer = CardNumber.defaultIssuer
	constructor(component: Component<any>) {
		super(component)
	}
	filter(character: string, index: number, accumulated: string): boolean {
		this.issuer = this.getIssuer(accumulated) || CardNumber.defaultIssuer
		return character >= "0" && character <= "9" && index < this.issuer.length
	}
	format(character: string, index: number): string {
		return character + (index % 4 == 3 && index + 1 < this.issuer.length ? " " : "")
	}
	getIssuer(value: string): CardIssuer & { name: string } | undefined {
		let result: CardIssuer & { name: string } = CardNumber.defaultIssuer
		for (const key in CardNumber.issuers)
			if (CardNumber.issuers.hasOwnProperty(key) && CardNumber.issuers[key].identification.test(value)) {
				result = { ...CardNumber.defaultIssuer, name: key, ...CardNumber.issuers[key] }
				break
			}
		return result
	}
	private static defaultIssuer: CardIssuer = { name: "unknown", verification: /^\d{19}$/, identification: /^\d/, length: 19, icon: "generic" }
	private static issuers: { [name: string]: Partial<CardIssuer> & { identification: RegExp } } = {
		amex: { verification: /^3[47][0-9]{13}$/, identification: /^3[47]/, length: 18, icon: "amex"},
		dankort: { verification: /^(5019)\d+$/, identification: /^(5019)\d+/, length: 19, icon: "generic"},
		diners: { verification: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/, identification: /^3(?:0[0-5]|[68][0-9])/, length: 14, icon: "diners" },
		discover: { verification: /^6(?:011|5[0-9]{2})[0-9]{12}$/, identification: /^6(?:011|5[0-9]{2})/, length: 19, icon: "generic" },
		electron: { verification: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/, identification: /^(4026|417500|4405|4508|4844|4913|4917)/, length: 19, icon: "generic" },
		interpayment: {verification: /^(636)\d+$/, identification: /^(636)/, length: 19, icon: "generic" },
		jcb: { verification: /^(?:2131|1800|35\d{3})\d{11}$/, identification: /^(?:2131|1800|35\d{3})/, length: 19, icon: "generic" },
		maestro: { verification: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/, identification: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)/, length: 19, icon: "maestro" },
		mastercard: { verification: /^5[1-5][0-9]{14}$/, identification: /^5[1-5][0-9]/, length: 19, icon: "mastercard" },
		unionpay: { verification: /^(62|88)\d+$/, identification: /^(62|88)/, length: 19, icon: "generic" },
		visa: { verification: /^4[0-9]{12}(?:[0-9]{3})?$/, identification: /^4[0-9]/, length: 16, icon: "visa" },
	}
}
TypeHandler.add("card-number", component => new CardNumber(component))
