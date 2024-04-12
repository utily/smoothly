import { Component, FunctionalComponent, h, Host, JSX, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-lazy",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyLazy {
	@Prop() hide = false
	@Prop() content?: JSX.Element | FunctionalComponent
	render() {
		return (
			<Host>
				<slot name="before"></slot>
				{!this.hide && (typeof this.content == "function" ? <this.content /> : this.content)}
				<slot></slot>
			</Host>
		)
	}
}
