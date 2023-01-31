import { Component, Element, Event, EventEmitter, h, Prop, State } from "@stencil/core"
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
	@Prop() size: "tiny" | "small" | "medium" | "large" = "small"
	@Prop({ mutable: true, reflect: true }) intermediate: boolean
	@Prop({ mutable: true, reflect: true }) selected: boolean
	@Prop({ mutable: true, reflect: true }) disabled: boolean
	@Event() checked: EventEmitter<{ selected: boolean }>
	@State() t: langly.Translate
	@Prop({ mutable: true, reflect: true }) keys?: any //store all data
	@Prop({ mutable: true, reflect: true }) index?: number

	componentWillLoad() {
		this.t = translation.create(this.element)
	}
	toggle(e: MouseEvent) {
		if (!this.disabled) {
			this.selected = !this.selected
			this.checked.emit({ selected: this.selected })
		}
		console.log(this.index)
		console.log(this.keys)
	}
	render() {
		return [
			<smoothly-icon
				class="checkbox"
				toolTip={this.t(
					this.intermediate && !this.selected
						? "Select all"
						: this.selectAll
						? "Select all"
						: !this.selected
						? "Select"
						: "De-select"
				)}
				onClick={e => this.toggle(e)}
				size={this.size}
				name={
					this.intermediate && !this.selected
						? "square-outline"
						: !this.selected
						? "square-outline"
						: "checkbox-outline"
				}
			/>,
		]
	}
}
