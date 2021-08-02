import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-item",
	styleUrl: "style.css",
	scoped: true,
})
export class Item {
	@Element() element: HTMLSmoothlyItemElement
	@Prop() value: any
	@Prop({ reflect: true, mutable: true }) selected: boolean
	@Event() itemLoaded: EventEmitter<void>
	@Event() itemSelected: EventEmitter<void>

	componentDidLoad() {
		this.itemLoaded.emit()
		if (this.selected)
			this.onClick()
	}
	@Listen("click")
	onClick() {
		this.selected = true
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
