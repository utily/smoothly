import { Component, h, Listen, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-toggle-switch",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyToggleSwitch {
	@Prop({ mutable: true, reflect: true }) selected = false
	@Prop({ reflect: true }) disabled = false
	@Prop() name: string
	@Prop() value?: any

	@Listen("click")
	onClick(e: UIEvent) {
		this.selected = !this.selected
	}

	render() {
		return (
			<button disabled={this.disabled} id="toggleBtn">
				<div class="circle"></div>
			</button>
		)
	}
}
