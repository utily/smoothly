import { Component, Event, EventEmitter, h, Host, Method, Prop, VNode, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-table-shadow-expandable-cell",
	styleUrl: "style.scss",
	shadow: true,
})
export class SmoothlyTableShadowExpandableCell {
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
	clickHandler(): void {
		this.open = !this.open
	}
	@Watch("open")
	openChange() {
		this.smoothlyTableExpandableCellChange.emit(this.open)
	}

	render(): VNode | VNode[] {
		return (
			<Host style={{ "--smoothly-table-cell-span": this.span?.toString(10) }}>
				<div onClick={() => this.clickHandler()} class="content">
					<slot />
				</div>
				{this.open && (
					<div class="detail">
						<slot name="detail" />
					</div>
				)}
			</Host>
		)
	}
}
