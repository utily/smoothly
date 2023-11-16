import { Component, h, Host, Prop } from "@stencil/core"
import { Color, Fill } from "../../model"

@Component({
	tag: "smoothly-toggle-switch",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyToggleSwitch {
	@Prop({ reflect: true }) checkmark = true
	@Prop({ mutable: true, reflect: true })
	selected = false
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) size: "small" | "default" | "large" = "default"
	@Prop({ reflect: true }) color: Color
	@Prop({ reflect: true }) fill: Fill = "clear"

	render() {
		return (
			<Host>
				<button disabled={this.disabled} onClick={() => (this.selected = !this.selected)}>
					<smoothly-icon
						color={this.color}
						name={!this.checkmark ? "ellipse" : this.selected ? "checkmark-circle" : "close-circle"}
						fill="clear"
						class={{ selected: this.selected }}></smoothly-icon>
				</button>
			</Host>
		)
	}
}
