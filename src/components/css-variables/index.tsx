import { Component, h, State } from "@stencil/core"

@Component({
	tag: "smoothly-css-variables",
})
export class SmoothlyCssVariables {
	@State() cssVariables: Record<string, string> = {}

	componentWillLoad() {
		const computedStyles = getComputedStyle(document.documentElement)
		this.cssVariables = Object.fromEntries(
			Object.values(computedStyles)
				.filter(v => v.startsWith("--smoothly-"))
				.map(k => [k, computedStyles.getPropertyValue(k)])
		)
	}

	render() {
		console.log("cssVariables", this.cssVariables)
		return Object.entries(this.cssVariables).map(([k, v]) => (
			<div>
				{k}: <strong>{v}</strong>
			</div>
		))
	}
}
