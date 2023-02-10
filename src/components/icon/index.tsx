import { Component, Prop, State, Watch } from "@stencil/core"
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
	@Prop({ reflect: true }) size: "tiny" | "small" | "medium" | "large" = "medium"
	@Prop() toolTip?: string
	@State() document?: string
	@Watch("name")
	async loadDocument() {
		if (this.name)
			this.document =
				this.name != "empty"
					? await SmoothlyIcon.load(this.name)
					: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
			<title>Empty</title>
			</svg>`
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
		const url = `https://site-icons.pages.dev/ionicons@5.0.0/dist/svg/${name}.svg`
		return SmoothlyIcon.cache[url] ?? (SmoothlyIcon.cache[url] = SmoothlyIcon.fetch(url))
	}
}
