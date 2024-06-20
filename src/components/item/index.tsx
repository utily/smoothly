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
	VNode,
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
	@Prop({ reflect: true }) selectable = true
	@Prop() deselectable = true
	@Event() smoothlyItemSelect: EventEmitter<HTMLSmoothlyItemElement>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>

	@Listen("click")
	clickHandler(): void {
		if (this.selectable && (!this.deselectable || !this.selected))
			this.selected = !this.selected
	}

	@Watch("selected")
	selectedWatcher(): void {
		this.smoothlyItemSelect.emit(this.element)
	}
	componentWillLoad(): void {
		this.smoothlyInputLoad.emit(() => {
			return
		})
	}
	componentDidLoad(): void {
		if (this.selected && this.selectable)
			this.smoothlyItemSelect.emit(this.element)
	}
	@Method()
	async filter(filter: string): Promise<void> {
		const value = typeof this.value === "string" ? this.value : JSON.stringify(this.value ?? "")
		this.element.hidden =
			filter && this.selectable
				? !(value.includes(filter) || this.element.innerText.toLowerCase().includes(filter))
				: false
	}
	render(): VNode | VNode[] {
		return (
			<Host tabIndex={-1}>
				<slot />
			</Host>
		)
	}
}
