import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from "@stencil/core"
import { Option } from "./option"
@Component({
	tag: "smoothly-picker",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPicker {
	@Prop() label = "Pick"
	@Prop() name = "pick"
	@Prop({ mutable: true, reflect: true }) open = false
	@Prop() multiple: true
	@State() selectedElement?: HTMLElement
	@State() selected = new Map<any, Option>()
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyChange: EventEmitter<Record<string, any>>

	@Watch("selected")
	componentDidLoad() {
		if (this.selectedElement)
			this.selectedElement.innerHTML = ""
		for (const option of this.selected.values())
			option.slotted.forEach(child => this.selectedElement?.appendChild(child))
		const selected = Array.from(this.selected.values(), option => option.value)
		this.smoothlyInput.emit({ [this.name]: selected })
		this.smoothlyChange.emit({ [this.name]: selected })
	}
	@Listen("smoothlyPickerOptionLoaded")
	optionLoadedHandler(event: CustomEvent<Option>) {
		event.stopPropagation()
		if (event.detail.selected)
			this.selected = new Map(this.selected.set(event.detail.name, event.detail).entries())
	}
	@Listen("smoothlyPickerOptionChanged")
	optionsSelected(event: CustomEvent<Option>) {
		event.stopPropagation()
		this.selected = event.detail.selected
			? new Map(this.selected.set(event.detail.name, event.detail).entries())
			: !this.selected.delete(event.detail.name)
			? this.selected
			: new Map(this.selected.entries())
	}
	clickHandler() {
		this.open = !this.open
	}
	render() {
		return (
			<Host>
				<div onClick={() => this.clickHandler()} ref={element => (this.selectedElement = element)} class={"selected"} />
				<span onClick={() => this.clickHandler()} class={"label"}>
					{this.label}
				</span>
				<button onClick={() => this.clickHandler()} type={"button"}>
					<smoothly-icon name={this.open ? "chevron-down-outline" : "chevron-forward-outline"} />
				</button>
				<smoothly-picker-menu class={"menu"}>
					<slot />
				</smoothly-picker-menu>
			</Host>
		)
	}
}
