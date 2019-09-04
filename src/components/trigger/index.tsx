// tslint:disable-next-line: no-implicit-dependencies
import { Component, Prop, Event, EventEmitter, Listen, h } from "@stencil/core"
import { Color, Expand, Fill, Trigger } from "smoothly-model"

@Component({
	tag: "smoothly-trigger",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTrigger {
	@Prop({ reflect: true }) color: Color | undefined
	@Prop({ reflect: true }) expand: Expand
	@Prop({ reflect: true }) fill: Fill
	@Prop({ reflect: true }) disabled: boolean = false
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
		return <button disabled={ this.disabled } name={ this.name }><slot></slot></button>
	}
}
