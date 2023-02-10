import { Component, Event, EventEmitter, h, Prop } from "@stencil/core"
import { Color, Fill } from "../../model"
import { Button } from "../Button"

@Component({
	tag: "smoothly-submit",
	styleUrl: "../button/style.css",
	scoped: true,
})
export class SmoothlySubmit {
	@Prop({ reflect: true }) color?: Color = "success"
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) type: "link" | "button" = "button"
	@Prop({ reflect: true }) size: "small" | "large" | "icon"
	@Prop({ reflect: true }) shape?: "rounded"
	@Event() smoothlySubmit: EventEmitter
	render() {
		return <Button disabled={this.disabled} type={this.type}></Button>
	}
}
