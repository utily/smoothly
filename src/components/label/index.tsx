import { Component, h, Host, Prop } from "@stencil/core"
import { Icon } from "../icon/Icon"

@Component({
	tag: "smoothly-label",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyLabel {
	@Prop({ reflect: true }) label?: string
	@Prop({ reflect: true }) icon?: Icon
	render() {
		return (
			<Host>
				{this.label && (
					<label>
						{this.icon && <smoothly-icon name={this.icon} />} {this.label}
					</label>
				)}
				<slot />
			</Host>
		)
	}
}
