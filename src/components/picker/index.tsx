import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from "@stencil/core"
import { Option } from "./option"
@Component({
	tag: "smoothly-picker",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPicker {
	@Prop() label = "Label"
	@Prop() name: string
	@Prop({ mutable: true, reflect: true }) open = false
	@Prop() multiple = false
	@Prop() mutable = false
	@Prop() searchLabel = "Search"
	@Prop() validator?: (value: string) => boolean
	@Prop() labeledDefault = false
	@State() selectedElement?: HTMLElement
	@State() selected = new Map<string, Option>()
	@Event() smoothlyInput: EventEmitter<Record<string, any | any[]>>
	@Event() smoothlyChange: EventEmitter<Record<string, any | any[]>>
	private options = new Map<string, Option>()

	@Watch("selected")
	componentDidLoad() {
		if (this.selectedElement)
			this.selectedElement.innerHTML = ""
		for (const option of this.selected.values())
			option.slotted.forEach(child => this.selectedElement?.appendChild(child))
		const selected = Array.from(this.selected.values(), option => option.value)
		this.smoothlyInput.emit({ [this.name]: this.multiple ? selected : selected.at(0) })
		this.smoothlyChange.emit({ [this.name]: this.multiple ? selected : selected.at(0) })
	}
	@Listen("smoothlyPickerOptionLoaded")
	optionLoadedHandler(event: CustomEvent<Option>) {
		event.stopPropagation()
		this.options.set(event.detail.element.name, event.detail)
		event.detail.element.multiple = this.multiple
		if (event.detail.element.selected)
			this.selected = this.multiple
				? new Map(this.selected.set(event.detail.element.name, event.detail).entries())
				: new Map().set(event.detail.element.name, event.detail)
	}
	@Listen("smoothlyPickerOptionChanged")
	optionsSelected(event: CustomEvent<Option>) {
		event.stopPropagation()
		if (this.multiple)
			this.selected = event.detail.element.selected
				? new Map(this.selected.set(event.detail.element.name, event.detail).entries())
				: !this.selected.delete(event.detail.element.name)
				? this.selected
				: new Map(this.selected.entries())
		else {
			for (const option of this.options.values())
				if (option.element != event.detail.element)
					option.element.selected = false
			this.selected = !event.detail.element.selected
				? new Map()
				: new Map().set(event.detail.element.name, event.detail)
		}
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
				<smoothly-picker-menu
					label={this.searchLabel}
					labeledDefault={this.labeledDefault}
					validator={this.validator}
					multiple={this.multiple}
					mutable={this.mutable}
					class={"menu"}>
					<slot />
				</smoothly-picker-menu>
			</Host>
		)
	}
}
