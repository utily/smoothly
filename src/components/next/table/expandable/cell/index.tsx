import { Component, Event, EventEmitter, h, Host, Method, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-table-expandable-cell",
	styleUrl: "style.scss",
	scoped: true,
})
export class SmoothlyNextTableExpandableCell {
	@Prop({ reflect: true }) span = 1
	@Prop({ mutable: true, reflect: true }) open = false
	@Event() smoothlyNextTableExpandableCellOpened: EventEmitter<void>
	@Event() smoothlyNextTableExpandableCellRegister: EventEmitter<void>
	componentWillLoad(): void {
		this.smoothlyNextTableExpandableCellRegister.emit()
	}
	@Method()
	async close(): Promise<void> {
		this.open = false
	}
	clickHandler(): void {
		this.open = !this.open
		this.smoothlyNextTableExpandableCellOpened.emit()
	}

	render(): VNode | VNode[] {
		return (
			<Host style={{ "--smoothly-table-cell-span": this.span.toString(10) }}>
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
