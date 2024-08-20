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
}
