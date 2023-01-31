import { Component, h, Listen, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-toggle",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyToggle {
	@Prop({ mutable: true, reflect: true }) selected: boolean
	@Prop({ reflect: true }) shape: "rounded"
	@Prop({ reflect: true }) disabled = false
	@Prop() name: string
	@Prop() value?: any

	@Listen("click")
	onClick(e: UIEvent) {
		this.selected = !this.selected
	}

	render() {
		return (
			<button>
				<slot name="icon-slot"></slot>
				<slot>{this.name}</slot>
			</button>
		)
	}
}
