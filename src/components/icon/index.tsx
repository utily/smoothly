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
	@Prop({ reflect: true }) name?: Icon | "empty"
	@Prop({ reflect: true }) size: "tiny" | "small" | "medium" | "large" = "medium"
	@Prop() toolTip?: string
	@State() document?: string
	@Watch("name")
	async loadDocument() {
		if (this.name)
			this.document =
				this.name != "empty"
					? (await Icon.load(this.name))?.replace(/(?<=^<svg\s?)/, `$& role="img"`)
					: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
			<title>Empty</title>
			</svg>`
	}
	async componentWillLoad() {
		this.loadDocument()
	}
	render() {
		return (
			<Host
				innerHTML={
					this.document
						? this.document
								.replace(` width="512" height="512"`, "")
								.replace(/(<title>)[\w\d\s-]*(<\/title>)/, `<title>${this.toolTip || ""}</title>`)
								.replace(/stroke:#000;/gi, "")
						: undefined
				}
			/>
		)
	}
}
