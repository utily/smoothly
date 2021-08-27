import {
	Component,
	ComponentDidLoad,
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
export class TableExpandableCell implements ComponentDidLoad {
	@Element() element: HTMLSmoothlyTableExpandableCellElement
	expansionElement?: HTMLTableRowElement
	@Event() expansionOpen: EventEmitter<HTMLElement>
	@Event() expansionLoaded: EventEmitter<void>
	@Prop() align: "left" | "center" | "right" = "left"
	@Prop({ mutable: true, reflect: true }) open: boolean
	@State() beginOpen: boolean
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
		this.expansionLoaded.emit()
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
