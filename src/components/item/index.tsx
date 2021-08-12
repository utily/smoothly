import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-item",
	styleUrl: "style.css",
	scoped: true,
})
export class Item {
	@Element() element: HTMLSmoothlyItemElement
	@Prop() value: any
	@Prop({ reflect: true, mutable: true }) selected: boolean
	@Event() itemSelected: EventEmitter<void>
	@Watch("selected")
	onSelectedChanged(value: boolean, old: boolean) {
		if (value && !old)
			this.itemSelected.emit()
	}
	@Listen("click")
	onClick() {
		this.selected = true
		this.itemSelected.emit()
	}
	componentDidLoad() {
		if (this.selected)
			this.itemSelected.emit()
	}
	@Method()
	async filter(filter: string): Promise<boolean> {
		const result = !(this.element.hidden = filter
			? !(this.value.toLowerCase().includes(filter) || this.element.innerText.toLowerCase().includes(filter))
			: false)
		return result
	}
	render() {
		return <slot />
	}
}
