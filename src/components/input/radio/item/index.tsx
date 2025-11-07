import { Component, Element, Event, EventEmitter, h, Host, Prop, State, VNode } from "@stencil/core"
import { Input } from "../../Input"
import { Looks } from "../../Looks"
import { SmoothlyInputRadio } from "../index"
import { RadioItemSelect } from "../RadioItemSelect"

@Component({
	tag: "smoothly-input-radio-item",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputRadioItem {
	@Element() element: HTMLInputElement
	private id: string
	@Prop({ mutable: true }) value: any
	@Prop({ mutable: true, reflect: true }) selected = false
	@Prop({ mutable: true, reflect: true }) looks?: Looks
	@Prop({ mutable: true }) name: string
	@State() disabled?: boolean
	@Event() smoothlyRadioItemSelect: EventEmitter<RadioItemSelect>
	@Event() smoothlyRadioItemRegister: EventEmitter<(parent: SmoothlyInputRadio) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyRadioItemRegister.emit(parent => {
			this.name = parent.name
			parent.listen(async p => {
				if (Input.is(p))
					this.disabled = p.disabled
			})
		})
		this.selected && this.inputHandler(false)
		this.id = "id-" + Math.random().toString(36).substring(2, 11)
	}
	inputHandler(userInitiated: boolean): void {
		this.smoothlyRadioItemSelect.emit({
			value: this.value,
			selected: this.selected,
			select: s => (this.selected = s),
			userInitiated,
		})
	}

	render(): VNode | VNode[] {
		return (
			<Host>
				<input
					id={this.id}
					name={this.name}
					type="radio"
					checked={this.selected}
					disabled={this.disabled}
					onClick={() => this.inputHandler(true)}
				/>
				<smoothly-icon name={this.selected ? "checkmark-circle" : "ellipse-outline"} size="small" tooltip="Select" />
				<label htmlFor={this.id}>
					<slot />
				</label>
				<slot name="content" />
			</Host>
		)
	}
}
