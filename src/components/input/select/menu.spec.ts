import { menu } from "./menu"

function item(text: string): HTMLSmoothlyItemElement {
	const element = document.createElement("smoothly-item") as unknown as HTMLSmoothlyItemElement
	element.textContent = text
	return element
}

describe("menu.insert", () => {
	it("keeps items in DOM order even when they register out of DOM order", () => {
		const container = document.createElement("div")
		document.body.appendChild(container)
		const a = item("a")
		const b = item("b")
		const c = item("c")
		container.append(a, b, c)

		let items: HTMLSmoothlyItemElement[] = []
		items = menu.insert(items, b)
		items = menu.insert(items, c)
		items = menu.insert(items, a)

		expect(items).toEqual([a, b, c])
	})
	it("appends items registered in DOM order as-is", () => {
		const container = document.createElement("div")
		document.body.appendChild(container)
		const a = item("a")
		const b = item("b")
		container.append(a, b)

		let items: HTMLSmoothlyItemElement[] = []
		items = menu.insert(items, a)
		items = menu.insert(items, b)

		expect(items).toEqual([a, b])
	})
})

describe("menu.next", () => {
	it("moves through items in DOM order, not registration order", () => {
		const container = document.createElement("div")
		document.body.appendChild(container)
		const a = item("a")
		const b = item("b")
		const c = item("c")
		container.append(a, b, c)

		let items: HTMLSmoothlyItemElement[] = []
		items = menu.insert(items, b)
		items = menu.insert(items, c)
		items = menu.insert(items, a)

		const first = menu.next(items, 1)
		expect(first.next).toBe(a)
		first.next.marked = true

		const second = menu.next(items, 1)
		expect(second.current).toBe(a)
		expect(second.next).toBe(b)
	})
})
