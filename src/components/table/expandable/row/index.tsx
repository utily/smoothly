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
	tag: "smoothly-table-expandable-row",
	styleUrl: "style.css",
	scoped: true,
})
export class TableExpandableRow implements ComponentWillLoad {
	private expansionElement?: HTMLTableRowElement
	@Element() element: HTMLSmoothlyTableRowElement
	@State() allowSpotlight = true
	@State() spotlight = true
	@Prop() align: "left" | "center" | "right" = "left"
	@Prop({ mutable: true, reflect: true }) open: boolean
	@Event() smoothlyExpansionOpen: EventEmitter<HTMLElement>
	@Event() smoothlyExpandableChange: EventEmitter<boolean>
	@Event() smoothlyExpandableLoad: EventEmitter<{ allowSpotlight: (allowed: boolean) => void }>
	@Watch("open")
	openChanged() {
		if (this.expansionElement)
			this.element.after(this.expansionElement)
		this.smoothlyExpandableChange.emit(this.open)
	}
	@Watch("open")
	@Watch("allowSpotlight")
	handleSpotlight() {
		this.spotlight = this.open && this.allowSpotlight
	}
	componentWillLoad() {
		setInterval(() => {
			this.open && this.expansionElement && this.element.after(this.expansionElement)
			console.log("hello")
		}, 10)
		this.smoothlyExpandableLoad.emit({
			allowSpotlight: (allowed: boolean) => (this.allowSpotlight = allowed),
		})
	}
	async componentDidRender(): Promise<void> {
		this.smoothlyExpansionOpen.emit(this.expansionElement)
		if (this.expansionElement && this.open) {
			console.log("testopen")
			this.element.after(this.expansionElement)
		} else {
			console.log("closed")
		}
	}
	@Listen("click")
	onClick(event: UIEvent) {
		event.stopPropagation()
		this.open = !this.open
	}
	@Listen("smoothlyTableLoad")
	handleTableLoaded(event: CustomEvent<(owner: EventTarget) => void>) {
		event.stopPropagation()
		event.detail(this.element)
	}
	render() {
		console.log("render")

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
