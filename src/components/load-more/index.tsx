import { Component, ComponentWillLoad, Element, Event, EventEmitter, h, Host, Prop, State, VNode } from "@stencil/core"
import { Scrollable } from "../../model/Scrollable"

@Component({
	tag: "smoothly-load-more",
	scoped: true,
})
export class LoadMore implements ComponentWillLoad {
	private scrollableParent?: HTMLElement
	@Element() element: HTMLSmoothlyLoadMoreElement
	@Prop() triggerMode: "scroll" | "intersection" = "intersection"
	@Prop() name = ""
	@Prop() multiple = false
	@State() inView: boolean
	@Event() smoothlyLoadMore: EventEmitter<string>

	checkInView() {
		if (this.inView)
			this.smoothlyLoadMore.emit(this.name)
	}

	connectedCallback() {
		if (this.triggerMode == "scroll") {
			this.inView && this.smoothlyLoadMore.emit(this.name)
			if (this.multiple || (!this.multiple && !this.inView)) {
				this.scrollableParent = Scrollable.findParent(this.element)
				this.scrollableParent?.addEventListener("scroll", this.checkInView.bind(this), { once: !this.multiple })
			}
		}
	}

	disconnectedCallback() {
		this.scrollableParent?.removeEventListener("scroll", this.checkInView.bind(this))
	}

	componentWillLoad(): void {
		const observer = new IntersectionObserver((entries, observer) => this.observationHandler(observer, entries))
		observer.observe(this.element)
	}

	observationHandler(observer: IntersectionObserver, entries: IntersectionObserverEntry[]): void {
		this.inView = (entries.find(entry => entry.target == this.element)?.intersectionRatio ?? 0) > 0
		if (this.inView) {
			this.smoothlyLoadMore.emit(this.name)
			!this.multiple && (observer.unobserve(this.element), observer.disconnect())
		}
	}

	render(): VNode | VNode[] {
		return <Host />
	}
}
