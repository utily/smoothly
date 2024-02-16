import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { Notice, Option } from "../../model"
import { Clearable } from "../input/Clearable"
import { Input } from "../input/Input"
import { Looks } from "../input/Looks"
import { Controls } from "./menu"

@Component({
	tag: "smoothly-picker",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPicker implements Clearable, Input {
	@Element() element: HTMLSmoothlyPickerElement
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop({ reflect: true }) name: string
	@Prop({ reflect: true, mutable: true }) open = false
	@Prop({ reflect: true }) mutable = false
	@Prop({ reflect: true }) multiple = false
	@Prop({ reflect: true }) readonly = false
	@Prop() validator?: (value: string) => boolean | { result: boolean; notice: Notice }
	@State() selected = new Map<any, Option>()
	@State() display: Node[]
	@Event() smoothlyPickerLoaded: EventEmitter<Controls>
	@Event() smoothlyInput: EventEmitter<Record<string, any | any[]>> // multiple -> any[]
	@Event() smoothlyChange: EventEmitter<Record<string, any | any[]>> // multiple -> any[]
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks) => void>
	private controls?: Controls & { synced: () => boolean }

	componentWillLoad() {
		this.smoothlyInputLooks.emit(looks => (this.looks = looks))
	}

	@Watch("selected")
	selectedChanged() {
		const selected = Array.from(this.selected.values(), option => option.value)
		if (this.controls?.synced()) {
			this.smoothlyInput.emit({ [this.name]: this.multiple ? selected : selected.at(0) })
			this.smoothlyChange.emit({ [this.name]: this.multiple ? selected : selected.at(0) })
		}
		this.display = Array.from(this.selected.values(), option => {
			const span = document.createElement("span")
			option.slotted.forEach(node => span.appendChild(node.cloneNode(true)))
			return span
		})
	}

	componentDidLoad() {
		if (this.controls)
			this.smoothlyPickerLoaded.emit((({ synced, ...controls }) => controls)(this.controls))
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks: Looks) => void>) {
		if (event.target != this.element)
			event.stopPropagation()
	}
	@Listen("smoothlyPickerMenuLoaded")
	menuLoadedHandler(event: CustomEvent<Controls & { synced: () => boolean }>) {
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
	@Listen("click", { target: "window" })
	clickHandler(event: MouseEvent) {
		this.open = !event.composedPath().includes(this.element) ? false : !this.open
	}
	@Listen("focusin", { target: "window" })
	focusHandler(event: FocusEvent) {
		if (!event.composedPath().includes(this.element))
			this.open = false
	}
	@Method()
	async clear() {
		this.selected.forEach(option => option.selected && option.element.clickHandler())
	}
	render() {
		return (
			<Host tabindex={0}>
				<smoothly-slot-elements class={"selected"} nodes={this.display} />
				<span class={"label"}>
					<slot name={"label"} />
				</span>
				<button type="button">
					<smoothly-icon size="tiny" name={this.open ? "caret-down-outline" : "caret-forward-outline"} />
				</button>
				<slot name="child" />
				<smoothly-picker-menu
					open={this.open}
					looks={this.looks}
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
