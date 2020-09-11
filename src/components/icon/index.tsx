import { Component, State, Prop, Watch } from "@stencil/core"
import { Color, Fill } from "../../model"

@Component({
	tag: "smoothly-icon",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyIcon {
	@Prop({ reflect: true }) color: Color
	@Prop({ reflect: true }) fill: Fill = "solid"
	@Prop() name?: string
	@Prop({ reflect: true }) size: "small" | "medium" | "large" = "medium"
	@Prop() toolTip?: string
	@State() document?: string
	@Watch("name")
	async loadDocument() {
		if (this.name)
			this.document = await SmoothlyIcon.load(this.name)
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
	private static async fetch(url: string): Promise<string | undefined> {
		const response = await fetch(url)
		return response.ok ? response.text() : undefined
	}
	private static cache: { [url: string]: Promise<string | undefined> | undefined } = {}
	static async load(name: string): Promise<string | undefined> {
		const url = `https://unpkg.com/ionicons@5.0.0/dist/svg/${name}.svg`
		return SmoothlyIcon.cache[url] ?? (SmoothlyIcon.cache[url] = SmoothlyIcon.fetch(url))
	}
}
