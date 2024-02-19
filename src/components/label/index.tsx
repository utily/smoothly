import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-label",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyLabel {
	@Prop() color: string
	@Prop() name: string
	@Prop() description: string
	@Prop({ reflect: true }) shape: "rectangle" | "rounded"

	render() {
		return (
			<div
				title={this.description}
				style={{
					backgroundColor: `hsl(${this.color} 85% 70%)`,
				}}>
				{this.name}
			</div>
		)
	}
}
