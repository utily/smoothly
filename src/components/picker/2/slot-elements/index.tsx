import { Component, Element, h, Host, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-slot-elements",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySlotElements {
	@Element() element: HTMLElement
	@Prop({ mutable: true }) node: Node | Node[]

	@Watch("nodes")
	componentDidLoad() {
		this.element.innerHTML = ""
		if (this.node)
			if (Array.isArray(this.node))
				this.node.forEach(node => this.element.appendChild(node.cloneNode(true)))
			else
				this.element.appendChild(this.node.cloneNode(true))
	}
	render() {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
