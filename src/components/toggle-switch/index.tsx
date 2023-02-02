import { Component, h, Prop } from "@stencil/core"

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

	render() {
		return (
			<button disabled={this.disabled} id="toggleBtn" onClick={() => (this.selected = !this.selected)}>
				<div class="circle"></div>
			</button>
		)
	}
}
