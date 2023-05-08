import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Button } from "./../Button"

@Component({
	tag: "smoothly-submit",
	styleUrl: "../style.css",
	scoped: true,
})
export class SmoothlySubmit {
	@Prop({ reflect: true }) color?: Color = "success"
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) type: "link" | "button" = "button"
	@Prop({ reflect: true }) size: "flexible" | "small" | "large" | "icon"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop() prevent = true
	@Event() smoothlySubmit: EventEmitter

	@Listen("click")
	clickHandler() {
		this.smoothlySubmit.emit()
	}

	render() {
		return (
			<Button disabled={this.disabled} type={this.type}>
				<slot />
			</Button>
		)
	}
}
