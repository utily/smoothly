import { Component, Element, Event, EventEmitter, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-slotted-elements",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySottedElement {
	@Element() element: HTMLElement
	@Event() smoothlySlottedChange: EventEmitter<Node[]>

	componentDidRender() {
		console.log("slotted display", this.element, this.element.children)
		this.smoothlySlottedChange.emit(Array.from(this.element.children, child => child.cloneNode(true)))
	}
	render() {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
