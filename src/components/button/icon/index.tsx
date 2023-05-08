import { Component, h, Prop } from "@stencil/core"
import { Button } from "../Button"

@Component({
	tag: "smoothly-icon-button",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyIconButton {
	@Prop({ reflect: true }) icon: string //ändra till Icon
	@Prop({ reflect: true }) styles: Button.StyleProps
	@Prop({ reflect: true }) base: Button.BaseProps = {
		type: "button",
		disabled: false,
	}

	render() {
		return (
			<Button {...this.base} icon>
				<smoothly-icon fill={this.styles.fill} color={this.styles.fill && this.styles.color} name={this.icon} />
			</Button>
		)
	}
}
