import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-0-item",
	styleUrl: "style.css",
	scoped: true,
})
export class Item {
	@Element() element: HTMLSmoothly0ItemElement
	@Prop() value: any
	@Prop({ reflect: true, mutable: true }) selected: boolean
	@Prop({ reflect: true, mutable: true }) marked: boolean
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
			? !(
					(typeof this.value === "string" ? this.value : JSON.stringify(this.value)).toLowerCase().includes(filter) ||
					this.element.innerText.toLowerCase().includes(filter)
			  )
			: false)
		return result
	}
	render() {
		return (
			<Host tabIndex={-1}>
				<slot />
			</Host>
		)
	}
}
