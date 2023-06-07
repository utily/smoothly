import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from "@stencil/core"
import { Option } from "../../../model"
@Component({
	tag: "smoothly-picker-option",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyPickerOption {
	@Element() element: HTMLSmoothlyPickerOptionElement
	@Prop({ mutable: true, reflect: true }) selected = false
	@Prop({ mutable: true, reflect: true }) visible = true
	@Prop({ mutable: true }) value: any
	@Prop({ mutable: true }) search: string[] = []
	@State() readonly = false
	@State() slotted: Node[] = []
	@Event() smoothlyPickerOptionLoad: EventEmitter<Option.Load>
	@Event() smoothlyPickerOptionLoaded: EventEmitter<Option>
	@Event() smoothlyPickerOptionChange: EventEmitter<Option>
	get option(): Option {
		return {
			element: this.element,
			selected: this.selected,
			readonly: this.readonly,
			visible: this.visible,
			search: this.search,
			value: this.value,
			slotted: this.slotted,
			set: {
				selected: selected => (console.log("option set", this.value, "selected", selected), (this.selected = selected)),
				readonly: readonly => (this.readonly = readonly),
				visible: visible => (this.visible = visible),
				search: search => (this.search = search),
				value: value => (this.value = value),
			},
		}
	}
	@Watch("selected")
	@Watch("slotted")
	emitChange() {
		if (this.element.parentElement) {
			console.log("options emitting change", this.value, this.selected)
			this.smoothlyPickerOptionChange.emit(this.option)
		} else {
			console.log("options not connected", this.value, this.selected)
		}
	}

	componentWillLoad() {
		this.smoothlyPickerOptionLoad.emit((({ slotted, ...option }) => option)(this.option))
	}
	componentDidLoad() {
		this.smoothlyPickerOptionLoaded.emit(this.option)
	}
	slottedChangeHandler(event: CustomEvent<Node[]>) {
		console.log("option change", this.selected)
		event.stopPropagation()
		this.slotted = event.detail
	}
	@Method()
	async clickHandler() {
		if (!this.readonly) {
			this.selected = !this.selected
			console.log("option click", this.value, this.selected)
		}
	}

	render() {
		console.log("option render", this.value, this.selected)
		return (
			<Host class={{ visible: this.visible }} onClick={() => this.clickHandler()}>
				<div class={"display"}>
					<slot name="display" />
				</div>
				<div class={"content"}>
					<smoothly-slotted-elements onSmoothlySlottedChange={e => this.slottedChangeHandler(e)} clone>
						<slot />
					</smoothly-slotted-elements>
					<slot name={"label"} />
				</div>
				<button type={"button"}>
					<smoothly-icon name={this.selected ? "checkbox-outline" : "square-outline"} />
				</button>
			</Host>
		)
	}
}
