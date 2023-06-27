import { Component, Prop, State, Watch } from "@stencil/core"
import { Color, Fill, Icon } from "../../model"

@Component({
	tag: "smoothly-icon",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyIcon {
	@Prop({ reflect: true }) color: Color
	@Prop({ reflect: true }) fill: Fill = "solid"
	@Prop() name?: string
	@Prop({ reflect: true }) size: "tiny" | "small" | "medium" | "large" = "medium"
	@Prop() toolTip?: string
	@State() document?: string
	@Watch("name")
	async loadDocument() {
		if (this.name)
			this.document = await Icon.load(this.name)
	}
	async componentWillLoad() {
		await this.loadDocument()
	}
	hostData() {
		return {
			innerHTML: this.document
				? this.document
						.replace(` width="512" height="512"`, "")
						.replace(/(<title>)[\w\d\s-]*(<\/title>)/, `<title>${this.toolTip || ""}</title>`)
						.replace(/stroke:#000;/gi, "")
				: undefined,
		}
	}
	render() {
		return []
	}
}
