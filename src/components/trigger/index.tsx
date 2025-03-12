import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { Color, Fill, Trigger } from "../../model"

@Component({
	tag: "smoothly-trigger",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTrigger {
	@Prop({ reflect: true }) color: Color | undefined
	@Prop({ reflect: true }) fill: Fill
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) type: "link" | "button" = "button"
	@Prop() name: string
	@Prop() value?: any
	@Event() trigger: EventEmitter<Trigger>

	@Listen("click")
	onClick(e: UIEvent) {
		this.trigger.emit({ name: this.name, value: this.value })
		e.stopPropagation()
		e.preventDefault()
	}
	render() {
		let result: HTMLElement
		switch (this.type) {
			case "link":
				result = this.disabled ? (
					<slot />
				) : (
					<a onClick={e => this.onClick(e)}>
						<slot />
					</a>
				)
				break
			case "button":
				result = (
					<button disabled={this.disabled} name={this.name}>
						<slot />
					</button>
				)
				break
		}
		return result
	}
}
