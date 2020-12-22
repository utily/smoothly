import { Component, Element, Event, EventEmitter, Prop, State, h } from "@stencil/core"
import * as langly from "langly"
import * as translation from "./translation"
@Component({
	tag: "smoothly-checkbox",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyCheckbox {
	@Element() element: HTMLElement
	@Prop() selectAll = false
	@Prop({ mutable: true, reflect: true }) selected: boolean
	@Event() checked: EventEmitter<{ selected: boolean }>
	@State() t: langly.Translate

	componentWillLoad() {
		this.t = translation.create(this.element)
	}
	toggle() {
		this.selected = !this.selected
		this.checked.emit({ selected: this.selected })
	}
	render() {
		return [
			<smoothly-icon
				toolTip={this.t(this.selectAll ? "Deselect all" : "Deselect")}
				onClick={() => this.toggle()}
				style={{ display: this.selected ? "" : "none" }}
				name="checkbox-outline"></smoothly-icon>,
			<smoothly-icon
				toolTip={this.t(this.selectAll ? "Select all" : "Select")}
				onClick={() => this.toggle()}
				style={{ display: !this.selected ? "" : "none" }}
				name="square-outline"></smoothly-icon>,
		]
	}
}
