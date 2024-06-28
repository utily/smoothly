import { Component, h, Host, State } from "@stencil/core"

@Component({
	tag: "smoothly-css-variables",
})
export class SmoothlyCssVariables {
	@State() cssVariables: Record<string, string> = {}

	componentWillLoad() {
		const observer = new MutationObserver(mutation => {
			console.log("mutation!", mutation)
			setTimeout(() => this.updateCssVariables(), 2000)
		})
		const element = document.querySelector("#smoothly-css")
		console.log("link element", element)
		element && observer.observe(element, { attributes: true })
	}

	componentWillRender() {
		this.updateCssVariables()
	}
	updateCssVariables() {
		const computedStyles = getComputedStyle(document.documentElement)
		this.cssVariables = Object.fromEntries(
			Object.values(computedStyles)
				.filter(v => v.startsWith("--smoothly-"))
				.map(k => [k, computedStyles.getPropertyValue(k)])
		)
	}

	render() {
		console.log("cssVariables", this.cssVariables)
		return (
			<Host>
				<smoothly-button onClick={() => this.updateCssVariables()}>Update</smoothly-button>
				{Object.entries(this.cssVariables).map(([k, v]) => (
					<div>
						{k}: <strong>{v}</strong>
					</div>
				))}
			</Host>
		)
	}
}
