export namespace scroll {
	export function centerInView(container?: HTMLElement, item?: HTMLElement, behavior: ScrollBehavior = "smooth") {
		if (item && container) {
			container.scrollTo({
				top: item.offsetTop + item.offsetHeight / 2 - (container.clientHeight ?? 0) / 2,
				behavior,
			})
		}
	}
}
