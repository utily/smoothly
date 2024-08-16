import { Component, ComponentWillLoad, Element, Event, EventEmitter, h, Host, Prop, VNode } from "@stencil/core"
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
	@Event() smoothlyLoadMore: EventEmitter<string>

	checkInView(): boolean {
		let result = false
		const rect = this.element.getBoundingClientRect()
		const containerRect = this.scrollableParent?.getBoundingClientRect()
		if (containerRect && rect && rect.top >= containerRect.top && containerRect.bottom >= rect.bottom) {
			this.smoothlyLoadMore.emit(this.name)
			result = true
			!this.multiple && this.scrollableParent?.removeEventListener("scroll", this.checkInView.bind(this))
		}
		return result
	}

	findScrollableParent() {
		let parent: HTMLElement | null = this.element.parentElement
		while (parent && !isScrollable(parent))
			parent = parent.parentElement
		this.scrollableParent = parent && isScrollable(parent) ? parent : undefined
	}

	componentWillLoad(): void {
		if (this.triggerMode == "scroll") {
			this.findScrollableParent()
			const triggered = this.checkInView()
			if (this.multiple || (!this.multiple && !triggered)) {
				this.scrollableParent?.addEventListener("scroll", this.checkInView.bind(this))
			}
		} else if (this.triggerMode == "intersection") {
			const observer = new IntersectionObserver((entries, observer) => this.observationHandler(observer, entries))
			observer.observe(this.element)
		}
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
