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
	@Prop({ reflect: true }) position = -1
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
			position:
				this.position >= 0
					? this.position
					: Array.from(this.element.parentElement?.parentElement?.children ?? []).indexOf(
							this.element.parentElement ?? this.element
					  ),
			set: {
				selected: selected => (this.selected = selected),
				readonly: readonly => (this.readonly = readonly),
				visible: visible => (this.visible = visible),
				search: search => (this.search = search),
				value: value => (this.value = value),
			},
		}
	}
	@Watch("position")
	@Watch("selected")
	@Watch("slotted")
	emitChange() {
		if (this.element.parentElement)
			this.smoothlyPickerOptionChange.emit(this.option)
	}

	componentWillLoad() {
		this.smoothlyPickerOptionLoad.emit((({ slotted, ...option }) => option)(this.option))
	}
	componentDidLoad() {
		this.smoothlyPickerOptionLoaded.emit(this.option)
	}
	slottedChangeHandler(event: CustomEvent<Node[]>) {
		event.stopPropagation()
		this.slotted = event.detail
	}
	@Method()
	async clickHandler() {
		if (!this.readonly)
			this.selected = !this.selected
	}

	render() {
		return (
			<Host class={{ visible: this.visible }} onClick={() => this.clickHandler()}>
				<div part="display" class={"display"}>
					<slot name="display" />
				</div>
				<div part="content" class={"content"}>
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
