import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State } from "@stencil/core"

export interface Option2 {
	element: HTMLSmoothlyPickerOption2Element
	selected: boolean
	readonly: boolean
	visible: boolean
	value: any
	slotted: Node[]
	set: {
		selected: (selected: boolean) => void
		visible: (visible: boolean) => void
		readonly: (readonly: boolean) => void
		value: (value: any) => void
	}
}
export namespace Option2 {
	export type Load = Omit<Option2, "slotted">
	export interface Created {
		value: string
		selected: boolean
	}
}

@Component({
	tag: "smoothly-picker-option2",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyPickerOption2 {
	@Element() element: HTMLSmoothlyPickerOption2Element
	@Prop({ mutable: true, reflect: true }) selected = false
	@Prop({ mutable: true, reflect: true }) visible = true
	@Prop({ mutable: true }) value: any
	@State() readonly = false
	@State() slotted: Node[] = []
	@Event() smoothlyPickerOptionLoad: EventEmitter<Option2.Load>
	@Event() smoothlyPickerOptionLoaded: EventEmitter<Option2>
	@Event() smoothlyPickerOptionChange: EventEmitter<Option2>
	get option(): Option2 {
		return {
			element: this.element,
			selected: this.selected,
			readonly: this.readonly,
			visible: this.visible,
			value: this.value,
			slotted: this.slotted,
			set: {
				selected: (selected: boolean) => (this.selected = selected),
				readonly: (readonly: boolean) => (this.readonly = readonly),
				visible: (visible: boolean) => (this.visible = visible),
				value: (value: any) => (this.value = value),
			},
		}
	}
	componentWillLoad() {
		console.log("option load")
		this.smoothlyPickerOptionLoad.emit((({ slotted, ...option }) => option)(this.option))
	}
	componentDidLoad() {
		console.log("option loaded")
		this.smoothlyPickerOptionLoaded.emit(this.option)
	}
	slottedChangeHandler(event: CustomEvent<Node[]>) {
		event.stopPropagation()
		this.slotted = event.detail
		console.log("option change")
		this.smoothlyPickerOptionChange.emit(this.option)
	}
	@Method()
	async clickHandler() {
		if (!this.readonly) {
			this.selected = !this.selected
			console.log("option change")
			this.smoothlyPickerOptionChange.emit(this.option)
		}
	}

	render() {
		return (
			<Host onClick={() => this.clickHandler()}>
				<button type={"button"}>
					<smoothly-icon name={this.selected ? "checkbox-outline" : "square-outline"} />
				</button>
				<smoothly-slotted-elements onSmoothlySlottedChange={e => this.slottedChangeHandler(e)}>
					<slot />
				</smoothly-slotted-elements>
				<div>
					<slot name="display" />
				</div>
			</Host>
		)
	}
}
