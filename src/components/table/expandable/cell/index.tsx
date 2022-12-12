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
	@Event() expansionOpen: EventEmitter<HTMLElement>
	@Event() expansionLoad: EventEmitter<void>
	@Event() expandableChange: EventEmitter<boolean>
	@Event() expandableLoad: EventEmitter<{ allowSpotlight: (allowed: boolean) => void }>
	@Watch("open")
	openChanged(value: boolean) {
		if (this.expansionElement)
			if (value)
				this.beginOpen = true
			else
				this.element.append(this.expansionElement)
		this.expandableChange.emit(this.open)
	}
	@Watch("open")
	@Watch("allowSpotlight")
	handleSpotlight() {
		this.spotlight = this.open && this.allowSpotlight
	}
	componentWillLoad(): void {
		this.expansionLoad.emit()
		this.expandableLoad.emit({
			allowSpotlight: (allowed: boolean) => (this.allowSpotlight = allowed),
		})
	}
	componentDidRender(): void {
		if (this.beginOpen) {
			this.beginOpen = false
			this.expansionOpen.emit(this.expansionElement)
		}
	}
	@Listen("click")
	onClick() {
		this.open = !this.open
	}
	@Listen("tableLoad")
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
