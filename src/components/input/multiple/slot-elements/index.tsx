import { Component, Element, Event, EventEmitter, h, Host, Prop, Watch } from "@stencil/core"

export interface Slot {
	set: {
		nodes: (nodes: Node | Node[]) => void
	}
}

@Component({
	tag: "smoothly-multiple-slot-elements",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyMultipleSlotElements {
	@Element() element: HTMLElement
	@Prop({ mutable: true }) nodes?: string | string[]
	@Event() smoothlySlotEmpty: EventEmitter<Slot>

	@Watch("nodes")
	componentDidLoad() {
		this.element.innerHTML = ""
		console.log("slotted", this.nodes)

		if (this.nodes)
			if (Array.isArray(this.nodes))
				this.nodes.flat().forEach(node => (this.element.innerHTML += node))
			else
				this.element.innerHTML += this.nodes
	}
	render() {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
