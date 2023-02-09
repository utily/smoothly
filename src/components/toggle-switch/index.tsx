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
					<smoothly-icon
						name="checkmark-circle"
						fill="clear"
						style={{ display: this.selected ? "" : "none" }}></smoothly-icon>
					<smoothly-icon
						name="close-circle"
						fill="clear"
						style={{ display: !this.selected ? "" : "none" }}></smoothly-icon>
				</button>
			</Host>
		)
	}
}
