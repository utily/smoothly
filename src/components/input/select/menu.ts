export namespace menu {
	export function insert(items: HTMLSmoothlyItemElement[], item: HTMLSmoothlyItemElement): HTMLSmoothlyItemElement[] {
		const index = items.findIndex(
			existing => (item.compareDocumentPosition(existing) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
		)
		return index == -1 ? [...items, item] : [...items.slice(0, index), item, ...items.slice(index)]
	}
	export function next(
		items: HTMLSmoothlyItemElement[],
		direction: -1 | 1
	): { current?: HTMLSmoothlyItemElement; next: HTMLSmoothlyItemElement } {
		const selectable = items.filter(item => !item.hidden && !item.disabled)
		const currentIndex = selectable.findIndex(item => item.marked)
		let index: number
		if (currentIndex == -1) {
			index = 0
		} else {
			index = (currentIndex + direction + selectable.length) % selectable.length
		}
		return { current: selectable[currentIndex], next: selectable[index] }
	}
	export function hasVisibleItems(items: HTMLSmoothlyItemElement[]): boolean {
		return items.some(item => !item.getAttribute("hidden"))
	}
	export function markOnly(items: HTMLSmoothlyItemElement[], item: HTMLSmoothlyItemElement): void {
		items.map(i => (i.marked = i === item))
	}
	export function findFirstSelected(items: HTMLSmoothlyItemElement[]): HTMLSmoothlyItemElement | undefined {
		return items.find(item => item.selected)
	}
	export function findFirstMarked(items: HTMLSmoothlyItemElement[]): HTMLSmoothlyItemElement | undefined {
		return items.find(item => item.marked)
	}
}
