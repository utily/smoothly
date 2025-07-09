import { Component, Element, h, Host, Prop, State, Watch } from "@stencil/core"
import { Color, Fill } from "../../model"
import { Icon } from "../../model"

@Component({
	tag: "smoothly-icon",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyIcon {
	@Element() element: HTMLElement
	@Prop({ reflect: true }) color: Color
	@Prop({ reflect: true }) fill: Fill = "solid"
	@Prop({ reflect: true }) name: Icon | "empty" = "empty"
	@Prop({ reflect: true }) size?: "tiny" | "small" | "medium" | "large" | "xlarge"
	@Prop({ reflect: true }) rotate?: number
	@Prop({ reflect: true }) flip?: "x" | "y"
	@Prop() tooltip?: string
	@State() latestPromise: Promise<string | undefined>

	async componentWillLoad() {
		await this.nameChanged()
	}
	@Watch("tooltip")
	@Watch("name")
	async nameChanged() {
		if (this.name == "empty") {
			this.updateSvg()
			return
		}

		const promise = (this.latestPromise = Icon.load(this.name))
		const result = await promise
		if (promise != this.latestPromise)
			return

		if (result) {
			const svgElement = this.sanitizeSvg(result)
			this.updateSvg(svgElement)
		}
	}

	private sanitizeSvg(svg: string): SVGElement | undefined {
		const parser = new DOMParser()
		const document = parser.parseFromString(svg, "image/svg+xml")
		const svgElement = document.querySelector("svg")

		if (svgElement) {
			svgElement.setAttribute("role", "img")
			svgElement.removeAttribute("width")
			svgElement.removeAttribute("height")
		}
		return svgElement ?? undefined
	}
	updateSvg(svg?: SVGElement) {
		svg
			? this.element.replaceChildren(svg)
			: (this.element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
					<title>Empty</title>
				</svg>`)
	}

	render() {
		return <Host title={this.tooltip} style={{ ["--rotation"]: `${this.rotate ?? 0}deg` }} />
	}
}
