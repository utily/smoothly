import { Component, h, Host, Prop, State, Watch } from "@stencil/core"
import { Color, Fill } from "../../model"
import { Icon } from "../../model"

@Component({
	tag: "smoothly-icon",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyIcon {
	@Prop({ reflect: true }) color: Color
	@Prop({ reflect: true }) fill: Fill = "solid"
	@Prop({ reflect: true }) name: Icon | "empty" = "empty"
	@Prop({ reflect: true }) size?: "tiny" | "small" | "medium" | "large" | "xlarge"
	@Prop({ reflect: true }) rotate?: number
	@Prop({ reflect: true }) flip?: "x" | "y"
	@Prop() toolTip?: string
	@State() latestPromise: Promise<string | undefined>
	@State() document?: string

	async componentWillLoad() {
		await this.nameChanged()
	}
	@Watch("toolTip")
	@Watch("name")
	async nameChanged() {
		if (this.name == "empty") {
			this.updateDocument()
			return
		}

		const promise = (this.latestPromise = Icon.load(this.name))
		let result = await promise
		if (promise != this.latestPromise)
			return

		if (result) {
			result = this.cleanSvg(result)
			this.updateDocument(result)
		}
	}

	private cleanSvg(svg: string): string {
		console.log("Cleaning SVG", this.name, svg)
		const parser = new DOMParser()
		const document = parser.parseFromString(svg, "image/svg+xml")
		const svgElement = document.querySelector("svg")

		if (svgElement) {
			svgElement.setAttribute("role", "img")
			svgElement.removeAttribute("width")
			svgElement.removeAttribute("height")
			svgElement.querySelectorAll("[stroke]").forEach(el => {
				if (el.getAttribute("stroke")?.toLowerCase() === "#000")
					el.removeAttribute("stroke")
			})

			const titleElement = svgElement.querySelector("title")
			if (!this.toolTip) {
				titleElement?.remove()
			} else {
				if (titleElement) {
					titleElement.textContent = this.toolTip
				} else {
					const newTitleElement = document.createElement("title")
					newTitleElement.textContent = this.toolTip
					svgElement.appendChild(newTitleElement)
				}
			}
		}
		return svgElement?.outerHTML ?? ""
	}
	updateDocument(svg?: string) {
		this.document =
			svg ??
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
		<title>Empty</title>
		</svg>`
	}

	render() {
		return <Host innerHTML={this.document} style={{ ["--rotation"]: `${this.rotate ?? 0}deg` }} />
	}
}
