import { Component, FunctionalComponent, h, Host, JSX, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-lazy",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyLazy {
	@Prop({ mutable: true }) show = false
	@Prop() content?: JSX.Element | FunctionalComponent
	render() {
		return (
			<Host>
				<slot name="before"></slot>
				<smoothly-load-more
					onSmoothlyLoadMore={e => {
						this.show = true
						e.stopPropagation()
					}}
				/>
				{this.show && (typeof this.content == "function" ? <this.content /> : this.content)}
				<slot></slot>
			</Host>
		)
	}
}
