import { Component, Element, Event, EventEmitter } from "@stencil/core"

interface Draggable {
	element: HTMLElement
	top: number
	middle: number
	bottom: number
}

interface Dragged extends Draggable {
	startY: number
	offsetY: number
	index: number
	height: number
}

@Component({
	tag: "reorder-group",
	styleUrl: "style.css",
})
export class ReorderGroup {
	@Event() reorder: EventEmitter<[number, number]>
	@Element() element: HTMLReorderGroupElement
	private bounds?: DOMRect
	private children: Draggable[] = []
	private dragged?: Dragged
	private move?: { from: number; to: number }

	onMouseDown(event: MouseEvent) {
		if (!this.move && this.element.children.length > 1) {
			this.bounds = this.element.getBoundingClientRect()
			this.children = this.getChildren()
			const index = this.getCurrentIndex(event.clientY)
			this.dragged = {
				...this.children[index],
				startY: event.clientY,
				offsetY: event.clientY - this.children[index].middle,
				index,
				height:
					index < this.children.length - 1
						? this.children[index + 1].top - this.children[index].top
						: this.children[index].bottom - this.children[index - 1].bottom,
			}
			this.dragged.element.className += " dragging"
		}
	}

	onMouseMove(event: MouseEvent) {
		if (this.dragged && this.bounds && event.clientY >= this.bounds.top && event.clientY <= this.bounds.bottom) {
			const currentIndex = this.getCurrentIndex(event.clientY - this.dragged.offsetY)
			this.translate(this.dragged.index, currentIndex, event.clientY - this.dragged.startY)
		}
	}

	onMouseUp(event: MouseEvent) {
		if (this.dragged) {
			this.dragged.element.className = this.dragged.element.className.replace(" dragging", "")
			const index = this.getCurrentIndex(event.clientY - this.dragged.offsetY)
			this.translate(this.dragged.index, index, this.children[index].top - this.dragged.top)
			this.move = { from: this.dragged.index, to: index }
			this.dragged = undefined

			window.setTimeout(() => {
				if (this.move) {
					const children = [...this.children.map(c => c.element)]
					const e = children.splice(this.move.from, 1)
					children.splice(this.move.to, 0, ...e)
					children.forEach(child => this.element.removeChild(child))
					children.forEach(child => {
						child.style.transform = ""
						this.element.appendChild(child)
					})
					this.reorder.emit([this.move.from, this.move.to])
					this.move = undefined
				}
			}, 500)
		}
	}

	getChildren(): Draggable[] {
		const result: Draggable[] = []
		for (let index = 0; index < this.element.children.length; index++) {
			const element = this.element.children[index]
			if (element instanceof HTMLElement) {
				const bounds = element.getBoundingClientRect()
				result.push({
					top: bounds.top,
					middle: bounds.top + bounds.height / 2,
					bottom: bounds.bottom,
					element: element,
				})
			}
		}
		return result
	}

	private translate(fromIndex: number, toIndex: number, y: number) {
		for (let index = 0; index < this.children.length; index++) {
			let value: number
			if (this.dragged) {
				if (fromIndex < toIndex && index > fromIndex && index <= toIndex)
					value = -this.dragged.height
				else if (fromIndex > toIndex && index < fromIndex && index >= toIndex)
					value = this.dragged.height
				else
					value = index == fromIndex ? y : 0

				this.children[index].element.style.transform = `translateY(${value}px)`
			}
		}
	}

	private getCurrentIndex(y: number): number {
		return this.children.findIndex(c => y < c.bottom)
	}

	componentDidLoad() {
		this.element.childNodes.forEach(child => {
			child.addEventListener("mousedown", (e: MouseEvent) => this.onMouseDown(e))
			child.addEventListener("mousemove", (e: MouseEvent) => this.onMouseMove(e))
			child.addEventListener("mouseup", (e: MouseEvent) => this.onMouseUp(e))
		})
	}
}
