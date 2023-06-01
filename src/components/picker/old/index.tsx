import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { Notice, Option } from "../../../model"
import { Clearable } from "../../input/Clearable"
@Component({
	tag: "smoothly-picker-old",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerOld implements Clearable {
	private selectedElement?: HTMLElement
	@Element() element: HTMLSmoothlyPickerElement
	@Prop() label = "Label"
	@Prop() name: string
	@Prop({ mutable: true, reflect: true }) open = false
	@Prop() multiple = false
	@Prop() mutable = false
	@Prop({ reflect: true }) readonly = false
	@Prop() validator?: (value: string) => boolean | { result: boolean; notice: Notice }
	@Prop() labeledDefault = false
	@State() selected = new Map<string, Option>()
	@Event() smoothlyInput: EventEmitter<Record<string, any | any[]>>
	@Event() smoothlyChange: EventEmitter<Record<string, any | any[]>>

	@Method()
	async clear() {
		this.selected.forEach(key => {
			if (key.element.selected)
				key.element.clickHandler()
		})
	}
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
				? new Map(this.selected.set(event.detail.element.value, event.detail).entries())
				: new Map().set(event.detail.element.value, event.detail)
	}
	@Listen("smoothlyPickerOptionChanged")
	optionsSelectedHandler(event: CustomEvent<Option>) {
		event.stopPropagation()
		if (!this.readonly)
			if (this.multiple)
				this.selected = event.detail.element.selected
					? new Map(this.selected.set(event.detail.element.value, event.detail).entries())
					: !this.selected.delete(event.detail.element.value)
					? this.selected
					: new Map(this.selected.entries())
			else
				this.selected = !event.detail.element.selected
					? new Map()
					: new Map().set(event.detail.element.value, event.detail)
	}
	clickHandler = (event: MouseEvent) => {
		this.open = !event.composedPath().includes(this.element) ? false : !this.open
	}
	render() {
		return (
			<Host>
				<div ref={element => (this.selectedElement = element)} class={"selected"} />
				<span class={"label"}>
					<slot name="label" />
				</span>
				<button type={"button"}>
					<smoothly-icon name={this.open ? "chevron-down-outline" : "chevron-forward-outline"} />
				</button>
				<smoothly-picker-menu-old
					onClick={event => event.stopPropagation()}
					labeledDefault={this.labeledDefault}
					validator={this.validator}
					multiple={this.multiple}
					mutable={this.mutable}
					readonly={this.readonly}
					class={"menu"}>
					<slot name="search" slot="search" />
					<slot />
				</smoothly-picker-menu-old>
			</Host>
		)
	}
}
