import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-form-controll",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyFormControll {
	@Prop({ reflect: true }) label?: string
	render() {
		return (
			<Host>
				{this.label && <label>{this.label}</label>}
				<slot />
			</Host>
		)
	}
}
