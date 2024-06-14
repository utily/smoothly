import { Component, Element, Event, EventEmitter, h, Prop, State } from "@stencil/core"
import * as langly from "langly"
import * as translation from "./translation"
@Component({
	tag: "smoothly-0-checkbox",
	styleUrl: "style.css",
	scoped: true,
})
export class Smoothly0Checkbox {
	@Element() element: HTMLElement
	@Prop() selectAll = false
	@Prop() size: "tiny" | "small" | "medium" | "large" = "small"
	@Prop({ mutable: true, reflect: true }) intermediate: boolean
	@Prop({ mutable: true, reflect: true }) selected: boolean
	@Prop({ mutable: true, reflect: true }) disabled: boolean
	@Event() checked: EventEmitter<{ selected: boolean }>
	@State() t: langly.Translate

	componentWillLoad() {
		this.t = translation.create(this.element)
	}
	toggle() {
		if (!this.disabled) {
			this.selected = !this.selected
			this.checked.emit({ selected: this.selected })
		}
	}
	render() {
		return [
			<smoothly-0-icon
				toolTip={this.t(this.selectAll ? "Deselect all" : "Deselect")}
				onClick={() => this.toggle()}
				style={{ display: this.selected ? "" : "none" }}
				size={this.size}
				name="checkbox-outline"></smoothly-0-icon>,
			<smoothly-0-icon
				toolTip={this.t(this.intermediate && !this.selected ? "Deselect all" : "Select all")}
				onClick={() => this.toggle()}
				style={{ display: this.intermediate && !this.selected ? "" : "none" }}
				size={this.size}
				name="remove-outline"></smoothly-0-icon>,
			<smoothly-0-icon
				toolTip={this.t(this.selectAll ? "Select all" : "Select")}
				onClick={() => this.toggle()}
				style={{ display: !this.selected ? "" : "none" }}
				size={this.size}
				name="square-outline"></smoothly-0-icon>,
		]
	}
}
