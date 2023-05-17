import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-toggle-switch",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyToggleSwitch {
	@Prop({ mutable: true, reflect: true }) selected = false
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) size: "small" | "default" | "large" = "default"
	@Prop() name: string
	@Prop() value?: any
	render() {
		return (
			<Host>
				<button disabled={this.disabled} id="toggleBtn" onClick={() => (this.selected = !this.selected)}>
					<smoothly-icon name={this.selected ? "checkmark-circle" : "close-circle"} fill="clear" />
				</button>
			</Host>
		)
	}
}
