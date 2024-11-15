import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { Color, Fill } from "../../model"
import { Input } from "../input/Input"
@Component({
	tag: "smoothly-summary",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySummary {
	private inputs: Record<string, Input.Element> = {}
	@Prop({ mutable: true, reflect: true }) open = false
	@Prop() color: Color
	@Prop() fill: Fill = "solid"
	@Prop() size: "tiny" | "small" | "medium" | "large" = "tiny"
	@Event() smoothlySummaryOpen: EventEmitter<boolean>

	async toggleHandler(event: Event) {
		if (event.target instanceof HTMLDetailsElement) {
			this.open = event.target.open
			this.smoothlySummaryOpen.emit(this.open)
			this.open
				? await Promise.all(Object.values(this.inputs).map(input => input.register()))
				: await Promise.all(Object.values(this.inputs).map(input => input.unregister()))
		}
	}

	@Listen("smoothlyInputLoad")
	@Listen("smoothlyInput")
	onInputLoad(event: CustomEvent) {
		if (Input.Element.is(event.target)) {
			this.inputs[event.target.name] = event.target
			if (!this.open)
				event.stopPropagation()
		}
	}

	render() {
		return (
			<details onToggle={e => this.toggleHandler(e)} open={this.open}>
				<summary>
					<smoothly-icon name="caret-forward" color={this.color} fill={this.fill} size={this.size}></smoothly-icon>
					<slot name="summary"></slot>
				</summary>
				<slot name="content"></slot>
			</details>
		)
	}
}
