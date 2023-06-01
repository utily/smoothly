import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State } from "@stencil/core"

export interface Option {
	element: HTMLSmoothlyPickerOptionElement
	selected: boolean
	readonly: boolean
	visible: boolean
	search: string[]
	value: any
	slotted: Node[]
	set: {
		selected: (selected: boolean) => void
		visible: (visible: boolean) => void
		readonly: (readonly: boolean) => void
		search: (search: string[]) => void
		value: (value: any) => void
	}
}
export namespace Option {
	export type Load = Omit<Option, "slotted">
	export interface Created {
		value: string
		selected: boolean
	}
}

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
				selected: selected => (this.selected = selected),
				readonly: readonly => (this.readonly = readonly),
				visible: visible => (this.visible = visible),
				search: search => (this.search = search),
				value: value => (this.value = value),
			},
		}
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
		this.smoothlyPickerOptionChange.emit(this.option)
	}
	@Method()
	async clickHandler() {
		if (!this.readonly) {
			this.selected = !this.selected
			this.smoothlyPickerOptionChange.emit(this.option)
		}
	}

	render() {
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
