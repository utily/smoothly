// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Element, h, Host, Prop, State } from "@stencil/core"
import { CountryCode, Language } from "isoly"
import { getLanguage } from "langly"

@Component({
	tag: "smoothly-0-country",
	scoped: true,
})
export class SmoothlyCountry {
	@Prop() value: CountryCode.Alpha2
	@Prop() text: "alpha2" | "name" | "none" = "alpha2"
	@Element() element: HTMLElement
	@State() language?: Language
	componentWillLoad() {
		this.language = getLanguage(this.element)
	}
	render() {
		const name = this.language && this.value ? CountryCode.Name.from(this.language, this.value) : undefined
		return (
			<Host title={this.text == "alpha2" && name ? name : this.value}>
				{this.value?.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397)) +
					" " +
					(this.text == "alpha2" ? this.value : this.text == "name" ? name : "")}
			</Host>
		)
	}
}
