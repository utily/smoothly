export namespace layout {
	export function firstItemHeight(items: HTMLSmoothlyItemElement[]): number | undefined {
		return items.find(item => item.clientHeight > 0)?.clientHeight
	}
	export function applyMenuHeight(element: HTMLElement, itemHeight: number, menuHeight: MenuHeight): void {
		const height = menuHeight.endsWith("items")
			? `${itemHeight * +(menuHeight.match(/^(\d+(\.\d+)?|\.\d+)/g)?.[0] ?? "10")}px`
			: menuHeight
		element.style.setProperty("--menu-height", height)
	}
	export function applyElementHeight(element: HTMLElement) {
		element?.style.setProperty("--element-height", `${element.clientHeight}px`)
	}
	export type MenuHeight = `${number}${"items" | "rem" | "px" | "vh"}`
}
