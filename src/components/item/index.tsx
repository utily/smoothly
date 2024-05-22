import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-item",
	styleUrl: "style.css",
	scoped: true,
})
export class Item {
	@Element() element: HTMLSmoothlyItemElement
	@Prop() value: any
	@Prop({ reflect: true, mutable: true }) selected: boolean
	@Prop({ reflect: true, mutable: true }) marked: boolean
	@Prop() selectable = true
	@Event() smoothlyItemSelect: EventEmitter<void>
	@Watch("selected")
	onSelectedChanged(value: boolean, old: boolean) {
		if (value && !old && this.selectable)
			this.smoothlyItemSelect.emit()
	}
	@Listen("click")
	onClick() {
		if (this.selectable) {
			this.selected = true
			this.smoothlyItemSelect.emit()
		}
	}
	componentDidLoad() {
		if (this.selected && this.selectable)
			this.smoothlyItemSelect.emit()
	}
	@Method()
	async filter(filter: string): Promise<void> {
		const value = typeof this.value === "string" ? this.value : JSON.stringify(this.value ?? "")
		this.element.hidden = filter
			? !(value.includes(filter) || this.element.innerText.toLowerCase().includes(filter))
			: false
	}
	render() {
		return (
			<Host tabIndex={-1} class={!this.selectable ? "non-selectable" : ""}>
				<slot />
			</Host>
		)
	}
}
