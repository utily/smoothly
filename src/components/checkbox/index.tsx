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
	@Prop({ mutable: true, reflect: true }) checked: boolean
	@Prop({ mutable: true, reflect: true }) mid: boolean
	@Prop({ mutable: true, reflect: true }) selectAll = false
	@Prop() name = "checked"
	@Prop() value: any = true
	@Prop({ reflect: true }) disabled: boolean
	// @Event() smoothlyCheckAll: EventEmitter<{ checked: boolean }>
	// @Event() smoothlyChecked: EventEmitter<Record<string, boolean>>
	@Event() smoothlyChecked: EventEmitter<{ checked: boolean }>
	@State() t: langly.Translate

	componentWillLoad() {
		this.t = translation.create(this.element)
		// console.log("value:", this.value)
	}
	@Method()
	toggle() {
		if (!this.disabled)
			this.checked = !this.checked
		// this.smoothlyChecked.emit({ [this.name]: (this.checked, this.value) })
		this.smoothlyChecked.emit({ checked: this.checked })
		// console.log("checkbox", this.checked)
		// console.log("checkbox.value", this.value)
		// if (this.selectAll && !this.disabled)
		// 	//compare the length of data and checks and check all
		// 	this.smoothlyCheckAll.emit({ checked: this.checked })
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
				name={this.mid ? "remove-outline" : this.checked && !this.mid ? "checkmark-outline" : "square-outline"}
				class={!this.checked && !this.mid ? "hidden" : "outline"}
			/>
		)
	}
}
