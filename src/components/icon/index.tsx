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
		} else {
			const promise = (this.latestPromise = Icon.load(this.name))
			let result = await promise

			if (promise == this.latestPromise) {
				if (result) {
					result = this.cleanSvg(result)
					this.updateDocument(result)
				}
			}
		}
	}
	private cleanSvg(svg: string): string {
		svg = svg
			?.replace(/(?<=^<svg\s?)/, `$& role="img"`)
			.replace(` width="512" height="512"`, "")
			.replace(/stroke:#000;/gi, "")
		if (!this.toolTip)
			svg = svg?.replace(/<title>.*<\/title>/, "")
		else if (svg?.includes("<title>"))
			svg = svg.replace(/(<title>).*(<\/title>)/, `<title>${this.toolTip}</title>`)
		else
			svg = svg?.replace(/(.*>)(<\/svg>$)/, `$1<title>${this.toolTip}</title>$2`)
		return svg
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
