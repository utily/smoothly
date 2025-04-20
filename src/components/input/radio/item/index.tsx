import { Component, Element, Event, EventEmitter, h, Host, Prop, VNode } from "@stencil/core"
import { Looks } from "../../Looks"
import { Selectable } from "../Selected"

@Component({
	tag: "smoothly-input-radio-item",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputRadioItem {
	@Element() element: HTMLInputElement
	@Prop({ mutable: true }) value: any
	@Prop({ mutable: true, reflect: true }) selected = false
	@Prop({ mutable: true, reflect: true }) looks?: Looks
	@Prop({ mutable: true }) name: string
	@Event() smoothlySelect: EventEmitter<Selectable>
	@Event() smoothlyRadioItemRegister: EventEmitter<(name: string) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyRadioItemRegister.emit(name => (this.name = name))
		this.selected && this.inputHandler()
	}
	inputHandler(): void {
		this.smoothlySelect.emit({ value: this.value, selected: this.selected, select: s => (this.selected = s) })
	}

	render(): VNode | VNode[] {
		return (
			<Host onClick={() => this.inputHandler()}>
				<input name={this.name} type="radio" checked={this.selected} />
				<smoothly-icon name={this.selected ? "checkmark-circle" : "ellipse-outline"} size="small" toolTip="Select" />
				<label>
					<slot />
				</label>
			</Host>
		)
	}
}
