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
	@Prop({ reflect: true }) size: "tiny" | "small" | "medium" | "large" = "medium"
	@Prop({ reflect: true }) rotate?: number
	@Prop({ reflect: true }) flip?: "x" | "y"
	@Prop() toolTip?: string
	@State() document?: string
	@Watch("name")
	async componentWillLoad() {
		let result: string | undefined
		if (this.name != "empty") {
			result = await Icon.load(this.name)
			result = result
				?.replace(/(?<=^<svg\s?)/, `$& role="img"`)
				.replace(` width="512" height="512"`, "")
				.replace(/stroke:#000;/gi, "")
			if (!this.toolTip)
				result = result?.replace(/<title>.*<\/title>/, "")
			else if (result?.includes("<title>"))
				result = result.replace(/(<title>).*(<\/title>)/, `<title>${this.toolTip}</title>`)
			else
				result = result?.replace(/(.*>)(<\/svg>$)/, `$1<title>${this.toolTip}</title>$2`)
		}
		this.document =
			result ??
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
		<title>Empty</title>
		</svg>`
	}
	render() {
		return <Host innerHTML={this.document} style={{ ["--rotation"]: `${this.rotate ?? 0}deg` }} />
	}
}
