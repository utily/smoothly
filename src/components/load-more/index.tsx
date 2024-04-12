import { Component, Element, Event, EventEmitter, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-load-more",
	styleUrl: "style.css",
	scoped: true,
})
export class LoadMore {
	@Prop() offset = "0"
	@Prop() name = ""
	@Event() smoothlyLoadMore: EventEmitter<string>
	@Element() element: HTMLSmoothlyLoadMoreElement
	observer?: IntersectionObserver // possibly keep reference for GC
	componentDidLoad() {
		this.observer = new IntersectionObserver(
			entries => {
				if (entries.find(entry => entry.target == this.element)?.intersectionRatio ?? 0)
					this.smoothlyLoadMore.emit(this.name)
			},
			{
				threshold: 0,
			}
		)
		this.observer.observe(this.element)
	}
	render() {
		return <Host style={{ position: "relative", top: this.offset }}></Host>
	}
}
