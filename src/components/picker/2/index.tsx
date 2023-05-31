import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { Option2 } from "./option"

@Component({
	tag: "smoothly-picker2",
	scoped: true,
})
export class SmoothlyPicker2 {
	@Element() element: HTMLSmoothlyPicker2Element
	@Prop() name: string
	@Prop({ mutable: true, reflect: true }) open = false
	@Prop({ reflect: true }) mutable = false
	@Prop({ reflect: true }) multiple = false
	@Prop({ reflect: true }) readonly = false
	@State() selected = new Map<string, Option2>()
	@State() display: Node[]
	@Event() smoothlyInput: EventEmitter<Record<string, any | any[]>> // mutable -> any[]
	@Event() smoothlyChange: EventEmitter<Record<string, any | any[]>> // mutable -> any[]

	componentWillLoad() {
		window.addEventListener("click", this.clickHandler)
	}
	@Watch("selected")
	componentDidLoad() {
		const selected = Array.from(this.selected.values(), option => option.value)
		this.smoothlyInput.emit({ [this.name]: this.multiple ? selected : selected.at(0) })
		this.smoothlyChange.emit({ [this.name]: this.multiple ? selected : selected.at(0) })
	}
	@Listen("smoothlyPickerOptionLoaded")
	optionLoadedHandler(event: CustomEvent<Option2>) {
		if (event.detail.selected)
			this.selected = this.multiple
				? new Map(this.selected.set(event.detail.value, event.detail).entries())
				: new Map().set(event.detail.value, event.detail)
	}

	@Listen("smoothlyPickerOptionChange")
	optionChangeHandler(event: CustomEvent<Option2>) {
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
				<smoothly-slot-elements node={this.display} />
				<span class={"label"}>
					<slot name={"label"} />
				</span>
				<button type="button">
					<smoothly-icon name={this.open ? "chevron-down-outline" : "chevron-forward-outline"} />
				</button>
				<smoothly-picker-menu2
					onClick={e => e.stopPropagation()}
					multiple={this.multiple}
					mutable={this.mutable}
					readonly={this.readonly}>
					<slot name="search" slot="search" />
					<slot />
				</smoothly-picker-menu2>
			</Host>
		)
	}
}
