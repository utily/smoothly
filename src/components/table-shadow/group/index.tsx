import { Component, Event, EventEmitter, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-shadow-row-group",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableShadowRowGroup {
	@Prop({ reflect: true }) align = false
	@Prop({ reflect: true, mutable: true }) open = false
	@Event() smoothlyTableRowGroupChange: EventEmitter<boolean>

	clickHandler(): void {
		this.open = !this.open
		this.smoothlyTableRowGroupChange.emit(this.open)
	}

	render(): VNode | VNode[] {
		return (
			<Host>
				<div onClick={() => this.clickHandler()}>
					<div>
						<slot name={"start"} />
					</div>
					<div>
						<slot name={"end"} />
					</div>
				</div>
				<div>
					<slot />
				</div>
			</Host>
		)
	}
}
