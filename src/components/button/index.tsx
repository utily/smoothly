import { Component, h, Prop } from "@stencil/core"
import { Color, Fill } from "../../model"
import { Button } from "./Button"

@Component({
	tag: "smoothly-button",
	styleUrl: "../button/style.css",
	scoped: true,
})
export class SmoothlyButton {
	@Prop({ reflect: true }) color?: Color
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) type: "link" | "button" = "button"
	@Prop({ reflect: true }) size: "small" | "large" | "icon" | "flexible"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop() link?: string
	@Prop() download?: boolean

	render() {
		return (
			<Button disabled={this.disabled} type={this.type} link={this.link} download={this.download}>
				<slot />
			</Button>
		)
	}
}
