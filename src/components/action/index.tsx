import { Component, Prop, Event, EventEmitter, Listen } from "@stencil/core"
import { Color } from "../../Color"
import { Expand } from "../../Expand"
import { Fill } from "../../Fill"
@Component({
	tag: "smoothly-action",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAction {
	@Prop({ reflectToAttr: true }) color: Color | undefined
	@Prop({ reflectToAttr: true }) expand: Expand
	@Prop({ reflectToAttr: true }) fill: Fill
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
