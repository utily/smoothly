import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-label",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyLabel {
	@Prop() hue: string
	@Prop() description: string
	@Prop({ reflect: true }) shape: "rectangle" | "rounded"

	render() {
		return (
			<Host
				title={this.description}
				style={{
					backgroundColor: `hsl(${this.hue} 85% 70%)`,
				}}>
				<slot></slot>
			</Host>
		)
	}
}
