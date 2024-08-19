export function isScrollable(element: HTMLElement) {
	const overflow = window.getComputedStyle(element).overflowY
	return (
		element.scrollHeight > element.clientHeight &&
		(overflow == "auto" || overflow == "scroll" || document.documentElement == element)
	)
}
