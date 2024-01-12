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
	@Prop() toolTip?: string
	@State() document?: string
	@Watch("name")
	async loadDocument(): Promise<string> {
		let result: string | undefined
		if (this.name != "empty") {
			result = await Icon.load(this.name)
			result = result
				?.replace(/(?<=^<svg\s?)/, `$& role="img"`)
				.replace(` width="512" height="512"`, "")
				.replace(/stroke:#000;/gi, "")
			if (result?.includes("<title>"))
				result = result.replace(/(<title>)[\w\d\s-]*(<\/title>)/, `<title>${this.toolTip || ""}</title>`)
			else
				result = result?.replace(/(.*>)(<\/svg>$)/, `$1<title>${this.toolTip || ""}</title>$2`)
		}
		return (
			result ??
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
		<title>Empty</title>
		</svg>`
		)
	}
	async componentWillLoad() {
		this.document = await this.loadDocument()
	}
	render() {
		return <Host innerHTML={this.document} />
	}
}
