import { Component, Element, h, Host, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-slot-elements",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySlotElements {
	@Element() element: HTMLElement
	@Prop() clone = false
	@Prop({ mutable: true }) node: Node | Node[]

	@Watch("node")
	componentDidLoad(current?: any, old?: any) {
		if (current)
			console.log("slot watcher")
		else
			console.log("slot did load")
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
