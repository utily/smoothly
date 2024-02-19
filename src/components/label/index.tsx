import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-label",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyLabel {
	@Prop() color: string
	@Prop() description: string
	@Prop({ reflect: true }) shape: "rectangle" | "rounded"

	render() {
		return (
			<Host
				title={this.description}
				style={{
					backgroundColor: `hsl(${this.color} 85% 70%)`,
				}}>
				<slot></slot>
			</Host>
		)
	}
}
