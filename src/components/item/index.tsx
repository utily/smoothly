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
import { Editable } from "../input/Editable"
import { Item } from "./Item"

@Component({
	tag: "smoothly-item",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyItem implements Item, ComponentWillLoad, ComponentDidLoad {
	@Element() element: HTMLSmoothlyItemElement
	@Prop() value: any
	@Prop({ reflect: true, mutable: true }) selected: boolean = false
	@Prop({ reflect: true, mutable: true }) marked: boolean
	@Prop({ reflect: true }) selectable = true
	@Prop({ reflect: true }) disabled = false
	@Prop() deselectable = true
	@Event() smoothlyItemSelect: EventEmitter<HTMLSmoothlyItemElement>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>

	@Listen("click")
	clickHandler(): void {
		if (this.selectable && !this.disabled && (!this.selected || this.deselectable))
			this.selected = !this.selected
	}
	@Watch("selected")
	selectedWatcher(): void {
		this.smoothlyItemSelect.emit(this.element)
	}
	componentWillLoad(): void {
		this.smoothlyInputLoad.emit(() => {})
	}
	componentDidLoad(): void {
		if (this.selected && this.selectable && !this.disabled)
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
