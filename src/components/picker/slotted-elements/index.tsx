import { Component, Element, Event, EventEmitter, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-slotted-elements",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySlottedElement {
	@Element() element: HTMLElement
	@Prop() clone = true
	@Event() smoothlySlottedChange: EventEmitter<Node[]>

	componentDidRender() {
		const slotted = Array.from(this.element.childNodes, child => {
			let result: Node | Node[]
			if (child instanceof HTMLSlotElement) {
				const assigned = child.assignedNodes()
				result = assigned.length
					? assigned.map(child => (this.clone ? child.cloneNode(true) : child))
					: this.clone
					? child.cloneNode(true)
					: child
			} else
				result = child
			return result
		}).flat()
		this.smoothlySlottedChange.emit(Array.from(slotted, child => (this.clone ? child.cloneNode(true) : child)))
	}
	render() {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
