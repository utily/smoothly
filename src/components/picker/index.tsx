import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { Notice, Option } from "../../model"
import { Clearable } from "../input/Clearable"
import { Controls } from "./menu"

@Component({
	tag: "smoothly-picker",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPicker implements Clearable {
	@Element() element: HTMLSmoothlyPickerElement
	@Prop() name: string
	@Prop({ mutable: true, reflect: true }) open = false
	@Prop({ reflect: true }) mutable = false
	@Prop({ reflect: true }) multiple = false
	@Prop({ reflect: true }) readonly = false
	@Prop() validator?: (value: string) => boolean | { result: boolean; notice: Notice }
	@State() selected = new Map<any, Option>()
	@State() display: Node[]
	@Event() smoothlyPickerLoaded: EventEmitter<Controls>
	@Event() smoothlyInput: EventEmitter<Record<string, any | any[]>> // mutable -> any[]
	@Event() smoothlyChange: EventEmitter<Record<string, any | any[]>> // mutable -> any[]
	private controls?: Controls

	@Watch("selected")
	selectedChanged() {
		const selected = Array.from(this.selected.values(), option => option.value)
		this.smoothlyInput.emit({ [this.name]: this.multiple ? selected : selected.at(0) })
		this.smoothlyChange.emit({ [this.name]: this.multiple ? selected : selected.at(0) })
		this.display = Array.from(this.selected.values(), option => {
			const span = document.createElement("span")
			option.slotted.forEach(node => span.appendChild(node.cloneNode(true)))
			return span
		})
	}

	componentWillLoad() {
		window.addEventListener("click", this.clickHandler)
	}
	componentDidLoad() {
		if (this.controls)
			this.smoothlyPickerLoaded.emit(this.controls)
	}
	@Listen("smoothlyPickerMenuLoaded")
	menuLoadedHandler(event: CustomEvent<Controls>) {
		this.controls = event.detail
	}
	@Listen("smoothlyPickerOptionLoaded")
	optionLoadedHandler(event: CustomEvent<Option>) {
		if (event.detail.selected)
			this.selected = this.multiple
				? new Map(this.selected.set(event.detail.value, event.detail).entries())
				: new Map().set(event.detail.value, event.detail)
	}

	@Listen("smoothlyPickerOptionChange")
	optionChangeHandler(event: CustomEvent<Option>) {
		if (!this.readonly)
			if (this.multiple)
				this.selected = event.detail.selected
					? new Map(this.selected.set(event.detail.value, event.detail).entries())
					: !this.selected.delete(event.detail.value)
					? this.selected
					: new Map(this.selected.entries())
			else
				this.selected = !event.detail.selected ? new Map() : new Map().set(event.detail.value, event.detail)
	}
	clickHandler = (event: MouseEvent) => {
		this.open = !event.composedPath().includes(this.element) ? false : !this.open
	}

	@Method()
	async clear() {
		this.selected.forEach(option => option.selected && option.element.clickHandler())
	}
	render() {
		return (
			<Host>
				<smoothly-slot-elements class={"selected"} nodes={this.display} />
				<span class={"label"}>
					<slot name={"label"} />
				</span>
				<button type="button">
					<smoothly-icon size="tiny" name={this.open ? "chevron-down-outline" : "chevron-forward-outline"} />
				</button>
				<smoothly-picker-menu
					onClick={e => e.stopPropagation()}
					multiple={this.multiple}
					mutable={this.mutable}
					readonly={this.readonly}
					validator={this.validator}>
					<slot name="search" slot="search" />
					<slot name="display" slot="display" />
					<slot />
				</smoothly-picker-menu>
			</Host>
		)
	}
}
