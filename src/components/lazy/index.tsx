import { Component, FunctionalComponent, h, Host, JSX, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-lazy",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyLazy {
	@Prop({ mutable: true }) show = false
	@Prop() content?: JSX.Element | FunctionalComponent

	loadMoreHandler(event: CustomEvent<string>): void {
		event.stopPropagation()
		this.show = true
	}

	render(): VNode | VNode[] {
		return (
			<Host>
				<slot name="before" />
				<smoothly-load-more onSmoothlyLoadMore={e => this.loadMoreHandler(e)} />
				{this.show && (typeof this.content == "function" ? <this.content /> : this.content)}
				<slot />
			</Host>
		)
	}
}
