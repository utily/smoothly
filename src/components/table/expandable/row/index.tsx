import { Component, Event, EventEmitter, h, Host, Prop, VNode, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-table-expandable-row",
	styleUrl: "style.scss",
	scoped: true,
})
export class SmoothlyTableExpandableRow {
	private div?: HTMLDivElement
	@Prop({ mutable: true, reflect: true }) open = false
	@Event() smoothlyTableExpandableRowChange: EventEmitter<boolean>

	clickHandler(event: MouseEvent): void {
		;(this.div && event.composedPath().includes(this.div)) || (this.open = !this.open)
	}
	@Watch("open")
	openChange() {
		this.smoothlyTableExpandableRowChange.emit(this.open)
	}

	render(): VNode | VNode[] {
		return (
			<Host onClick={(e: MouseEvent) => this.clickHandler(e)}>
				<div class={"detail"} ref={e => (this.div = e)}>
					<slot name="detail" />
				</div>
			</Host>
		)
	}
}
