import { Component, Prop, Event, EventEmitter, Listen } from "@stencil/core"

@Component({
	tag: "smoothly-action",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAction {
	@Prop() name: string
	@Event() smoothlyAction: EventEmitter

	@Listen("click")
	onClick(e: UIEvent) {
		this.smoothlyAction.emit({ name: this.name })
		e.stopPropagation()
		e.preventDefault()
	}
	render() {
		return <button name={ this.name }><slot></slot></button>
	}
}
