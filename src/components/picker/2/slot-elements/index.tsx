import { Component, Element, h, Host, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-slot-elements",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySlotElements {
	@Element() element: HTMLElement
	@Prop() clone = true
	@Prop({ mutable: true }) node: Node | Node[]

	@Watch("node")
	componentDidLoad() {
		console.log("slot node", this.node)
		this.element.innerHTML = ""
		if (this.node)
			if (Array.isArray(this.node))
				this.node.forEach(node => this.element.appendChild(this.clone ? node.cloneNode(true) : node))
			else
				this.element.appendChild(this.clone ? this.node.cloneNode(true) : this.node)
	}
	render() {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
