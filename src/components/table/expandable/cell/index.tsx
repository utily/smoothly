import { Component, ComponentDidLoad, Element, Event, EventEmitter, h, Host, Listen, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-table-expandable-cell",
	styleUrl: "style.css",
	scoped: true,
})
export class TableExpandableCell implements ComponentDidLoad {
	@Element() element: HTMLSmoothlyTableExpandableCellElement
	expansionElement?: HTMLTableRowElement
	@Event() expansionOpen: EventEmitter<HTMLElement>
	@Event() expansionLoad: EventEmitter<void>
	@Prop() align: "left" | "center" | "right" = "left"
	@Prop({ mutable: true, reflect: true }) open: boolean
	private beginOpen: boolean
	@Watch("open")
	openChanged(value: boolean) {
		if (this.expansionElement)
			if (value)
				this.beginOpen = true
			else
				this.element.append(this.expansionElement)
	}
	@Listen("click")
	onClick() {
		this.open = !this.open
	}
	componentDidLoad(): void {
		this.expansionLoad.emit()
	}
	componentDidRender(): void {
		if (this.beginOpen) {
			this.beginOpen = false
			this.expansionOpen.emit(this.expansionElement)
		}
	}
	render() {
		return (
			<Host style={{ textAlign: this.align }}>
				<aside>
					<smoothly-icon name="chevron-forward" size="tiny"></smoothly-icon>
					<slot></slot>
				</aside>
				<tr ref={e => (this.expansionElement = e)}>
					<td colSpan={999} class={!this.open ? "hide" : ""}>
						<div class="slot-detail">
							<slot name="detail"></slot>
						</div>
					</td>
				</tr>
			</Host>
		)
	}
}
