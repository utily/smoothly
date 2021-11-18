import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-quiet",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyQuiet {
	@Prop() color: string
	render() {
		return (
			<Host color={this.color}>
				<slot></slot>
			</Host>
		)
	}
}
