import { Component, Event, EventEmitter, h, Prop } from "@stencil/core"
@Component({
	tag: "smoothly-summary",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySummary {
	@Prop({ mutable: true, reflect: true }) open = false
	@Event() smoothlySummaryOpen: EventEmitter<boolean>

	async toggleHandler(event: Event) {
		if (event.target instanceof HTMLDetailsElement) {
			this.open = event.target.open
			this.smoothlySummaryOpen.emit(this.open)
		}
	}

	render() {
		return (
			<details onToggle={e => this.toggleHandler(e)} open={this.open}>
				<summary>
					<smoothly-icon name="caret-forward" fill="solid" size="tiny" />
					<slot name="summary" />
				</summary>
				<slot name="content" />
			</details>
		)
	}
}
