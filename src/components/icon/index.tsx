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
	@State() document?: string
	@Watch("name")
	async loadDocument() {
		if (this.name) {
			const url = `https://ionicons.com/ionicons/svg/md-${ this.name }.svg`
			const response = await fetch(url)
			this.document = response.ok ? await response.text() : undefined
		}
	}
	async componentWillLoad() {
		await this.loadDocument()
	}
	hostData() {
		console.log(this.document)
		return {
			innerHTML: this.document,
		}
	}
	render() {
		return []
	}
}
