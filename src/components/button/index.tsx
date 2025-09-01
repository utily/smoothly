import { Component, h, Prop } from "@stencil/core"
import { Color, Fill, Icon } from "../../model"
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
	@Prop({ reflect: true }) icon?: Icon
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) type: Button.Properties["type"]
	@Prop({ reflect: true }) size: "small" | "large" | "icon" | "flexible"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop() link?: string

	render() {
		return (
			<Button disabled={this.disabled} type={this.type} link={this.link}>
				{this.icon && <smoothly-icon name={this.icon} />}
				<slot />
			</Button>
		)
	}
}
