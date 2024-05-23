import {
	Component,
	ComponentDidLoad,
	ComponentWillLoad,
	Element,
	Event,
	EventEmitter,
	h,
	Host,
	Listen,
	Method,
	Prop,
	Watch,
} from "@stencil/core"
import { Item } from "./Item"

@Component({
	tag: "smoothly-item",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyItem implements Item, ComponentWillLoad, ComponentDidLoad {
	@Element() element: HTMLSmoothlyItemElement
	@Prop() value: any
	@Prop({ reflect: true, mutable: true }) selected: boolean
	@Prop({ reflect: true, mutable: true }) marked: boolean
	@Prop() selectable = true
	@Event() smoothlyItemSelect: EventEmitter<void>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
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
	componentWillLoad() {
		this.smoothlyInputLoad.emit(() => {
			return
		})
	}
	componentDidLoad() {
		if (this.selected && this.selectable)
			this.smoothlyItemSelect.emit()
	}
	@Method()
	async filter(filter: string): Promise<void> {
		const value = typeof this.value === "string" ? this.value : JSON.stringify(this.value ?? "")
		this.element.hidden =
			filter && this.selectable
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
