export namespace Scrollable {
	export function is(element: HTMLElement): boolean {
		const overflow = window.getComputedStyle(element).overflowY
		return (
			overflow == "scroll" ||
			((overflow == "auto" || document.documentElement == element) && element.scrollHeight > element.clientHeight)
		)
	}
	export function findParent(element: HTMLElement): HTMLElement | undefined {
		let parent: HTMLElement | null = element.parentElement
		while (parent && !is(parent))
			parent = parent.parentElement
		return parent && is(parent) ? parent : undefined
	}

	export function isBottomVisible(element?: HTMLElement): boolean {
		let result = false
		if (element) {
			const { bottom } = element.getBoundingClientRect()
			result = bottom <= window.innerHeight && bottom >= 0
		}
		return result
	}

	export function isTopVisible(element?: HTMLElement): boolean {
		let result = false
		if (element) {
			const { top } = element.getBoundingClientRect()
			result = top <= window.innerHeight && top >= 0
		}
		return result
	}
}
