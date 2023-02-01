import { Component, Element, Event, EventEmitter, h, Method, Prop, State } from "@stencil/core"
import * as langly from "langly"
import * as translation from "./translation"
@Component({
	tag: "smoothly-checkbox",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyCheckbox {
	@Element() element: HTMLElement
	@Prop() size: "tiny" | "small" | "medium" | "large" = "tiny"
	@Prop({ mutable: true, reflect: true }) checked = false
	@Prop({ mutable: true, reflect: true }) intermediate: boolean
	@Prop() name = "checked"
	@Prop() value: any = true
	@Prop({ reflect: true }) disabled: boolean
	@Event() smoothlyChecked: EventEmitter<Record<string, boolean | "intermediate" | any>>
	@State() t: langly.Translate

	componentWillLoad() {
		this.t = translation.create(this.element)
		console.log("value", this.value)
	}
	@Method()
	toggle() {
		if (!this.disabled)
			this.smoothlyChecked.emit({ [this.name]: (this.checked = !this.checked) || this.value })
		console.log(this.checked)
	}
	render() {
		return (
			<smoothly-icon
				toolTip={this.t(!this.checked ? "Select" : "De-select")}
				onClick={e => {
					this.toggle()
					e.stopPropagation()
				}}
				size={this.size}
				name={this.intermediate ? "remove-outline" : this.checked ? "checkmark-outline" : "square-outline"}
				class={!this.checked && !this.intermediate ? "hidden" : "outline"}
			/>
		)
	}
}
