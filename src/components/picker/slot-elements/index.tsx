import { Component, Element, Event, EventEmitter, h, Host, Prop, Watch } from "@stencil/core"

export interface Slot {
	set: {
		nodes: (nodes: Node | Node[]) => void
	}
}

@Component({
	tag: "smoothly-slot-elements",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySlotElements {
	@Element() element: HTMLElement
	@Prop() clone = true
	@Prop({ mutable: true }) nodes?: Node | Node[]
	@Event() smoothlySlotEmpty: EventEmitter<Slot>

	componentWillLoad() {
		if (!this.nodes)
			this.smoothlySlotEmpty.emit({
				set: {
					nodes: nodes => (this.nodes = nodes),
				},
			})
	}

	@Watch("nodes")
	componentDidLoad() {
		this.element.innerHTML = ""
		if (this.nodes)
			if (Array.isArray(this.nodes))
				this.nodes.forEach(node => this.element.appendChild(this.clone ? node.cloneNode(true) : node))
			else
				this.element.appendChild(this.clone ? this.nodes.cloneNode(true) : this.nodes)
	}
	render() {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
