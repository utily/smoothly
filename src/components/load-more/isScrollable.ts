export function isScrollable(element: HTMLElement) {
	const overflow = window.getComputedStyle(element).overflowY
	return (
		overflow == "scroll" ||
		((overflow == "auto" || document.documentElement == element) && element.scrollHeight > element.clientHeight)
	)
}
