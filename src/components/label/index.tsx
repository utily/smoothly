import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-label",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyLabel {
	@Prop() hue?: number
	@Prop() description?: string
	@Prop({ reflect: true }) shape: "rectangle" | "rounded"

	render() {
		return (
			<Host
				title={this.description}
				style={{
					"--hue": this.hue?.toString(),
				}}>
				<slot></slot>
			</Host>
		)
	}
}
