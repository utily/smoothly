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
	@Prop({ mutable: true }) selected = false
	@Prop({ mutable: true, reflect: true }) looks: Looks = "plain"
	@Prop({ mutable: true }) name: string
	@Event() smoothlySelect: EventEmitter<Selectable>
	@Event() smoothlyRadioButtonRegister: EventEmitter<(name: string) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyRadioButtonRegister.emit(name => (this.name = name))
		this.selected && this.inputHandler()
	}
	inputHandler(): void {
		this.smoothlySelect.emit({ value: this.value, selected: this.selected, select: s => (this.selected = s) })
	}

	render(): VNode | VNode[] {
		return (
			<Host onClick={() => this.inputHandler()}>
				<input name={this.name} type="radio" checked={this.selected} />
				<smoothly-icon
					name={this.selected ? "checkmark-circle" : "ellipse-outline"}
					size="medium"
					fill="outline"
					color={this.selected ? "success" : "medium"}
					toolTip="Select"
				/>
				<label>
					<slot />
				</label>
			</Host>
		)
	}
}
