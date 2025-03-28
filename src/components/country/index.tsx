import { Component, Element, h, Host, Prop, State } from "@stencil/core"
import { isoly } from "isoly"
import { getLanguage } from "langly"

@Component({
	tag: "smoothly-country",
	scoped: true,
})
export class SmoothlyCountry {
	@Prop() value: isoly.CountryCode.Alpha2
	@Prop() text: "alpha2" | "name" | "none" = "alpha2"
	@Element() element: HTMLElement
	@State() language?: isoly.Language
	componentWillLoad() {
		this.language = getLanguage(this.element)
	}
	render() {
		const name = this.language && this.value ? isoly.CountryCode.Name.from(this.language, this.value) : undefined
		return (
			<Host title={this.text == "alpha2" && name ? name : this.value}>
				{this.value?.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397)) +
					" " +
					(this.text == "alpha2" ? this.value : this.text == "name" ? name : "")}
			</Host>
		)
	}
}
