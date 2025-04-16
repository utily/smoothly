import { Component, Event, EventEmitter, h, Host, Method, Prop, VNode, Watch } from "@stencil/core"
@Component({
	tag: "smoothly-table-expandable-cell",
	styleUrl: "style.scss",
	scoped: true,
})
export class SmoothlyTableExpandableCell {
	private detailElement?: HTMLDivElement
	@Prop({ reflect: true }) span?: number = 1
	@Prop({ mutable: true, reflect: true }) open = false
	@Event() smoothlyTableExpandableCellChange: EventEmitter<boolean>
	@Event() smoothlyTableExpandableCellRegister: EventEmitter<void>
	componentWillLoad(): void {
		this.smoothlyTableExpandableCellRegister.emit()
	}
	@Method()
	async close(): Promise<void> {
		this.open = false
	}
	clickHandler(event: MouseEvent): void {
		this.detailElement && !event.composedPath().includes(this.detailElement) && (this.open = !this.open)
	}
	@Watch("open")
	openChange() {
		this.smoothlyTableExpandableCellChange.emit(this.open)
	}

	render(): VNode | VNode[] {
		return (
			<Host
				style={{ "--smoothly-table-cell-span": this.span?.toString(10) }}
				onClick={(e: MouseEvent) => this.clickHandler(e)}>
				<div class={"content"}>
					<slot />
				</div>
				<div class={"detail"} ref={(el: HTMLDivElement) => (this.detailElement = el)}>
					<slot name={"detail"} />
				</div>
			</Host>
		)
	}
}
