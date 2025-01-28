import { Component, Event, EventEmitter, h, Host, Prop } from "@stencil/core"
import { Color, Fill } from "../../model"

@Component({
	tag: "smoothly-toggle-switch",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyToggleSwitch {
	@Prop({ reflect: true }) checkmark = true
	@Prop({ mutable: true, reflect: true }) selected = false
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) size: "tiny" | "small" | "default" | "large" = "default"
	@Prop({ reflect: true }) color: Color = "medium"
	@Prop({ reflect: true }) fill: Fill = "clear"
	@Event() smoothlyToggleSwitchChange: EventEmitter<boolean>

	handleClick() {
		this.selected = !this.selected
		this.smoothlyToggleSwitchChange.emit(this.selected)
	}

	render() {
		return (
			<Host>
				<button type="button" disabled={this.disabled} onClick={() => this.handleClick()}>
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
