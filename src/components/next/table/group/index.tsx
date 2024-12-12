import { Component, Event, EventEmitter, h, Host, Prop, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-next-table-row-group",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyNextTableRowGroup {
	@Prop({ reflect: true }) align = false
	@Prop({ reflect: true, mutable: true }) open = false
	@Event() smoothlyNextTableRowGroupChange: EventEmitter<boolean>

	clickHandler(): void {
		this.open = !this.open
		this.smoothlyNextTableRowGroupChange.emit(this.open)
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
