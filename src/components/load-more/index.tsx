import { Component, ComponentWillLoad, Element, Event, EventEmitter, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-load-more",
	styleUrl: "style.css",
	scoped: true,
})
export class LoadMore implements ComponentWillLoad {
	@Element() element: HTMLSmoothlyLoadMoreElement
	@Prop() offset = "0"
	@Prop() name = ""
	@Prop() multiple = false
	@Event() smoothlyLoadMore: EventEmitter<string>

	componentWillLoad(): void {
		const observer = new IntersectionObserver((entries, observer) => this.observationHandler(observer, entries))
		observer.observe(this.element)
	}

	observationHandler(observer: IntersectionObserver, entries: IntersectionObserverEntry[]): void {
		if (entries.find(entry => entry.target == this.element)?.intersectionRatio ?? 0) {
			this.smoothlyLoadMore.emit(this.name)
			!this.multiple && (observer.unobserve(this.element), observer.disconnect())
		}
	}

	render(): VNode | VNode[] {
		return <Host style={{ "--offset": `${this.offset}` }} />
	}
}
