import { Component, Element, Event, EventEmitter, h, Host, Prop, State, VNode } from "@stencil/core"
import { Input } from "../../Input"
import { Looks } from "../../Looks"
import { SmoothlyInputRadio } from "../index"
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
	@State() disabled?: boolean
	@Event() smoothlySelect: EventEmitter<Selectable>
	@Event() smoothlyRadioItemRegister: EventEmitter<(parent: SmoothlyInputRadio) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyRadioItemRegister.emit(parent => {
			this.name = parent.name
			parent.listen(async p => {
				if (Input.is(p))
					this.disabled = p.disabled
			})
		})
		this.selected && this.inputHandler()
	}
	inputHandler(): void {
		this.smoothlySelect.emit({ value: this.value, selected: this.selected, select: s => (this.selected = s) })
	}

	render(): VNode | VNode[] {
		return (
			<Host onClick={() => this.inputHandler()}>
				<input name={this.name} type="radio" checked={this.selected} disabled={this.disabled} />
				<smoothly-icon name={this.selected ? "checkmark-circle" : "ellipse-outline"} size="small" tooltip="Select" />
				<label>
					<slot />
				</label>
			</Host>
		)
	}
}
