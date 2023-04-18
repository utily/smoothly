import {
	Component,
	ComponentWillLoad,
	Element,
	Event,
	EventEmitter,
	h,
	Host,
	Listen,
	Prop,
	State,
	Watch,
} from "@stencil/core"

@Component({
	tag: "smoothly-table-expandable-cell",
	styleUrl: "style.css",
	scoped: true,
})
export class TableExpandableCell implements ComponentWillLoad {
	private expansionElement?: HTMLTableRowElement
	private beginOpen: boolean
	@Element() element: HTMLSmoothlyTableExpandableCellElement
	@State() allowSpotlight = true
	@State() spotlight = true
	@Prop() align: "left" | "center" | "right" = "left"
	@Prop({ mutable: true, reflect: true }) open: boolean
	@Event() smoothlyExpansionOpen: EventEmitter<HTMLElement>
	@Event() smoothlyExpansionLoad: EventEmitter<void>
	@Event() smoothlyExpandableChange: EventEmitter<boolean>
	@Event() smoothlyExpandableLoad: EventEmitter<{ allowSpotlight: (allowed: boolean) => void }>
	@Watch("open")
	openChanged(value: boolean) {
		if (this.expansionElement)
			if (value)
				this.beginOpen = true
			else
				this.element.append(this.expansionElement)
		this.smoothlyExpandableChange.emit(this.open)
	}
	@Watch("open")
	@Watch("allowSpotlight")
	handleSpotlight() {
		this.spotlight = this.open && this.allowSpotlight
	}
	componentWillLoad(): void {
		this.smoothlyExpansionLoad.emit()
		this.smoothlyExpandableLoad.emit({
			allowSpotlight: (allowed: boolean) => (this.allowSpotlight = allowed),
		})
	}
	componentDidRender(): void {
		if (this.beginOpen) {
			this.beginOpen = false
			this.smoothlyExpansionOpen.emit(this.expansionElement)
		}
	}
	@Listen("click")
	onClick() {
		this.open = !this.open
	}
	@Listen("smoothlyTableLoad")
	handleTableLoaded(event: CustomEvent<(owner: EventTarget) => void>) {
		event.stopPropagation()
		event.detail(this.element)
	}
	render() {
		return (
			<Host style={{ textAlign: this.align }}>
				<aside>
					<smoothly-icon name="chevron-forward" size="tiny"></smoothly-icon>
					<slot></slot>
				</aside>
				<tr class={this.spotlight ? "spotlight" : ""} ref={e => (this.expansionElement = e)}>
					<td colSpan={999} class={!this.open ? "hide" : ""}>
						<slot name="detail"></slot>
					</td>
				</tr>
			</Host>
		)
	}
}
