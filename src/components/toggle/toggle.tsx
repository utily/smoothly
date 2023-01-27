import { Component, h, Listen, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-toggle",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyToggle {
	@Prop({ mutable: true, reflect: true }) selected: boolean
	@Prop({ reflect: true }) disabled = false
	@Prop() name: string
	@Prop() value?: any

	@Listen("click")
	onClick(e: UIEvent) {
		this.selected = !this.selected
	}

	render() {
		return <smoothly-button></smoothly-button>
	}
}
