import { Component, ComponentWillLoad, Element, Event, EventEmitter, h, Host, Prop, State, VNode } from "@stencil/core"
import { isScrollable } from "./isScrollable"

@Component({
	tag: "smoothly-load-more",
	styleUrl: "style.css",
	scoped: true,
})
export class LoadMore implements ComponentWillLoad {
	private scrollableParent?: HTMLElement
	@Element() element: HTMLSmoothlyLoadMoreElement
	@Prop() offset = "0"
	@Prop() triggerMode: "scroll" | "intersection" = "intersection"
	@Prop() name = ""
	@Prop() multiple = false
	@State() inView: boolean
	@Event() smoothlyLoadMore: EventEmitter<string>

	checkInView() {
		if (this.inView) {
			this.smoothlyLoadMore.emit(this.name)
		}
	}

	findScrollableParent() {
		let parent: HTMLElement | null = this.element.parentElement
		while (parent && !isScrollable(parent))
			parent = parent.parentElement
		this.scrollableParent = parent && isScrollable(parent) ? parent : undefined
	}

	componentWillLoad(): void {
		const observer = new IntersectionObserver((entries, observer) => this.observationHandler(observer, entries))
		observer.observe(this.element)
	}

	componentDidLoad() {
		if (this.triggerMode == "scroll") {
			this.inView && this.smoothlyLoadMore.emit(this.name)
			if (this.multiple || (!this.multiple && !this.inView)) {
				this.findScrollableParent()
				this.scrollableParent?.addEventListener("scroll", this.checkInView.bind(this), { once: !this.multiple })
			}
		}
	}

	observationHandler(observer: IntersectionObserver, entries: IntersectionObserverEntry[]): void {
		this.inView = (entries.find(entry => entry.target == this.element)?.intersectionRatio ?? 0) > 0
		if (this.inView) {
			this.smoothlyLoadMore.emit(this.name)
			!this.multiple && (observer.unobserve(this.element), observer.disconnect())
		}
	}

	render(): VNode | VNode[] {
		return <Host style={{ "--offset": `${this.offset}` }} />
	}
}
