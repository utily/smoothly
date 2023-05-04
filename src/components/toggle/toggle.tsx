import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-toggle",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyToggle {
	@Prop({ mutable: true, reflect: true }) selected = false
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true }) disabled = false
	@Prop() name: string
	@Prop() value?: any
	@Prop({ reflect: true }) size: "small" | "default" | "large" = "default"
	@Prop() icon?: string // Change to Icon
	@Event() smoothlyToggle: EventEmitter<{ name: string; value: any; selected: boolean }>

	@Listen("click")
	onClick() {
		this.selected = !this.selected
		this.smoothlyToggle.emit({ name: this.name, value: this.value, selected: this.selected })
	}

	render() {
		console.log("render")
		return <button>{this.icon ? <smoothly-icon name={this.icon}></smoothly-icon> : <slot></slot>}</button>
	}
}
