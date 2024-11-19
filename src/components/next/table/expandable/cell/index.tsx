import { Component, Event, EventEmitter, h, Host, Method, Prop, VNode, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-next-table-expandable-cell",
	styleUrl: "style.scss",
	scoped: true,
})
export class SmoothlyNextTableExpandableCell {
	@Prop({ reflect: true }) span?: number = 1
	@Prop({ mutable: true, reflect: true }) open = false
	@Event() smoothlyNextTableExpandableCellOpen: EventEmitter<void>
	@Event() smoothlyNextTableExpandableCellRegister: EventEmitter<void>
	@Event() smoothlyCellExpandChange: EventEmitter<boolean>
	componentWillLoad(): void {
		this.smoothlyNextTableExpandableCellRegister.emit()
	}
	@Method()
	async close(): Promise<void> {
		this.open = false
	}
	clickHandler(): void {
		this.open = !this.open
	}
	@Watch("open")
	openChange() {
		this.smoothlyCellExpandChange.emit(this.open)
		if (this.open)
			this.smoothlyNextTableExpandableCellOpen.emit()
	}

	render(): VNode | VNode[] {
		return (
			<Host style={{ "--smoothly-table-cell-span": this.span?.toString(10) }}>
				<div onClick={() => this.clickHandler()} class={"content"}>
					<slot />
				</div>
				<div class={"detail"}>
					<slot name={"detail"} />
				</div>
			</Host>
		)
	}
}
