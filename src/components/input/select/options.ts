export namespace options {
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
