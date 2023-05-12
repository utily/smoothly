import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from "@stencil/core"
import { Notice, Option } from "../../model"
@Component({
	tag: "smoothly-picker",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPicker {
	private selectedElement?: HTMLElement
	@Element() element: HTMLSmoothlyPickerElement
	@Prop() label = "Label"
	@Prop() name: string
	@Prop({ mutable: true, reflect: true }) open = false
	@Prop() multiple = false
	@Prop() mutable = false
	@Prop() readonly = false
	@Prop() searchLabel = "Search"
	@Prop() validator?: (value: string) => boolean | { result: boolean; notice: Notice }
	@Prop() labeledDefault = false
	@State() selected = new Map<string, Option>()
	@Event() smoothlyInput: EventEmitter<Record<string, any | any[]>>
	@Event() smoothlyChange: EventEmitter<Record<string, any | any[]>>

	componentWillLoad() {
		window.addEventListener("click", this.clickHandler)
	}
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
		if (event.detail.element.selected)
			this.selected = this.multiple
				? new Map(this.selected.set(event.detail.element.name, event.detail).entries())
				: new Map().set(event.detail.element.name, event.detail)
	}
	@Listen("smoothlyPickerOptionChanged")
	optionsSelectedHandler(event: CustomEvent<Option>) {
		event.stopPropagation()
		if (!this.readonly)
			if (this.multiple)
				this.selected = event.detail.element.selected
					? new Map(this.selected.set(event.detail.element.name, event.detail).entries())
					: !this.selected.delete(event.detail.element.name)
					? this.selected
					: new Map(this.selected.entries())
			else
				this.selected = !event.detail.element.selected
					? new Map()
					: new Map().set(event.detail.element.name, event.detail)
	}
	clickHandler = (event: MouseEvent) => {
		this.open = !event.composedPath().includes(this.element) ? false : !this.open
	}
	render() {
		return (
			<Host>
				<div ref={element => (this.selectedElement = element)} class={"selected"} />
				<span class={"label"}>{this.label}</span>
				<button type={"button"}>
					<smoothly-icon name={this.open ? "chevron-down-outline" : "chevron-forward-outline"} />
				</button>
				<smoothly-picker-menu
					onClick={event => event.stopPropagation()}
					label={this.searchLabel}
					labeledDefault={this.labeledDefault}
					validator={this.validator}
					multiple={this.multiple}
					mutable={this.mutable}
					readonly={this.readonly}
					class={"menu"}>
					<slot />
				</smoothly-picker-menu>
			</Host>
		)
	}
}
