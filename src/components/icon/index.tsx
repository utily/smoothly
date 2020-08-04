// tslint:disable-next-line: no-implicit-dependencies
import { Component, State, Prop, Watch } from "@stencil/core"
import { Color, Fill } from "smoothly-model"

@Component({
	tag: "smoothly-icon",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyIcon {
	@Prop({ reflectToAttr: true }) color: Color
	@Prop({ reflectToAttr: true }) fill: Fill = "solid"
	@Prop() name?: string
	@Prop({ reflectToAttr: true }) size: "small" | "medium" | "large" = "medium"
	@Prop() toolTip?: string
	@State() document?: string
	@Watch("name")
	async loadDocument() {
		if (this.name) {
			const url = `https://unpkg.com/ionicons@5.0.0/dist/svg/${ this.name }.svg`
			this.document = SmoothlyIcon.cache[url]
			if (!this.document) {
				const response = await fetch(url)
				this.document = response.ok ? (await response.text()).replace(/(<title>)[\w\d\s\-]*(<\/title>)/, `<title>${ this.toolTip || "" }</title>`) : undefined
				SmoothlyIcon.cache[url] = this.document
			}
		}
	}
	async componentWillLoad() {
		await this.loadDocument()
	}
	hostData() {
		return {
			innerHTML: this.document ? this.document.replace(` width="512" height="512"`, "") : undefined,
		}
	}
	render() {
		return []
	}
	private static cache: { [url: string]: string | undefined } = {}
}
