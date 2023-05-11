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
	@Element() element: HTMLSmoothlyTableRowElement
	@State() allowSpotlight = true
	@State() spotlight = true
	@Prop() align: "left" | "center" | "right" = "left"
	@Prop({ mutable: true, reflect: true }) open: boolean
	@Event() smoothlyExpansionOpen: EventEmitter<HTMLElement>
	@Event() smoothlyExpandableChange: EventEmitter<boolean>
	@Event() smoothlyExpandableLoad: EventEmitter<{ allowSpotlight: (allowed: boolean) => void }>

	@Watch("open")
	@Watch("allowSpotlight")
	handleSpotlight() {
		this.spotlight = this.open && this.allowSpotlight
	}
	componentWillLoad() {
		this.smoothlyExpandableLoad.emit({
			allowSpotlight: (allowed: boolean) => (this.allowSpotlight = allowed),
		})
	}
	@Listen("smoothlyTableLoad")
	handleTableLoaded(event: CustomEvent<(owner: EventTarget) => void>) {
		event.stopPropagation()
		event.detail(this.element)
	}
	render() {
		return (
			<Host style={{ textAlign: this.align }}>
				<div style={{ textAlign: this.align }} onClick={e => (e.stopPropagation(), (this.open = !this.open))}>
					<slot></slot>
				</div>
				<tr class={{ spotlight: this.spotlight }}>
					<td colSpan={999} class={{ hide: !this.open }}>
						<slot name="detail"></slot>
					</td>
				</tr>
			</Host>
		)
	}
}
