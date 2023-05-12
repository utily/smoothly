import { Prop } from "@stencil/core"
import { Component, Event, EventEmitter, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-expandable-trigger",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyExpandableTrigger {
	private container?: HTMLElement
	@Prop({ mutable: true, reflect: true }) open = false
	@Event() smoothlyExpansion: EventEmitter<ChildNode[] | undefined>
	handleTrigger() {
		this.open = !this.open
		this.smoothlyExpansion.emit(!this.open ? undefined : Array.from(this.container?.childNodes ?? []))
	}
	render() {
		return (
			<Host>
				<smoothly-button onClick={() => this.handleTrigger()}></smoothly-button>
				<div style={{ display: "none" }} ref={e => (this.container = e)}>
					<slot></slot>
				</div>
			</Host>
		)
	}
}
