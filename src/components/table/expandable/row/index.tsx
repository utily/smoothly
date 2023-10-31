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
	tag: "smoothly-0-table-expandable-row",
	styleUrl: "style.css",
	scoped: true,
})
export class TableExpandableRow implements ComponentWillLoad {
	private expansionElement?: HTMLTableRowElement
	@Element() element: HTMLSmoothly0TableRowElement
	@State() allowSpotlight = true
	@State() spotlight = true
	@Prop() align: "left" | "center" | "right" = "left"
	@Prop({ mutable: true, reflect: true }) open: boolean
	@Event() expansionOpen: EventEmitter<HTMLElement>
	@Event() expandableChange: EventEmitter<boolean>
	@Event() expandableLoad: EventEmitter<{ allowSpotlight: (allowed: boolean) => void }>
	@Watch("open")
	openChanged() {
		if (this.expansionElement)
			this.element.after(this.expansionElement)
		this.expandableChange.emit(this.open)
	}
	@Watch("open")
	@Watch("allowSpotlight")
	handleSpotlight() {
		this.spotlight = this.open && this.allowSpotlight
	}
	componentWillLoad() {
		this.expandableLoad.emit({
			allowSpotlight: (allowed: boolean) => (this.allowSpotlight = allowed),
		})
	}
	componentDidRender(): void {
		this.expansionOpen.emit(this.expansionElement)
		if (this.expansionElement && this.open)
			this.element.after(this.expansionElement)
	}
	@Listen("click")
	onClick(event: UIEvent) {
		event.stopPropagation()
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
				<slot></slot>
				<tr class={this.spotlight ? "spotlight" : ""} ref={e => (this.expansionElement = e)}>
					<td colSpan={999} class={!this.open ? "hide" : ""}>
						<slot name="detail"></slot>
					</td>
				</tr>
			</Host>
		)
	}
}
