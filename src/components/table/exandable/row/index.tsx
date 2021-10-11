import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-table-expandable-row",
	styleUrl: "style.css",
	scoped: true,
})
export class TableExpandableRow {
	@Element() element: HTMLSmoothlyTableExpandableRowElement
	expansionElement?: HTMLTableRowElement
	@Event() expansionOpen: EventEmitter<HTMLElement>
	@Event() expansionLoaded: EventEmitter<void>
	@Prop() align: "left" | "center" | "right" = "left"
	@Prop({ mutable: true, reflect: true }) open: boolean
	@State() beginOpen: boolean
	@Watch("open")
	openChanged(value: boolean) {
		if (this.expansionElement)
			this.element.after(this.expansionElement)
	}
	@Listen("click")
	onClick(e: UIEvent) {
		this.open = !this.open
		console.log(this.open)
		e.stopPropagation()
	}

	componentDidRender(): void {
		this.expansionOpen.emit(this.expansionElement)
	}
	render() {
		return (
			<Host style={{ textAlign: this.align }}>
				<slot></slot>
				<tr ref={e => (this.expansionElement = e)}>
					<td colSpan={500} class={!this.open ? "hide" : ""}>
						<slot name="detail"></slot>
					</td>
				</tr>
			</Host>
		)
	}
}
