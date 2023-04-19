import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-picker-option",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerOption {
	@Prop() name: string
	@Prop() value: any
	@Event() smoothlyPickerOptionLoaded: EventEmitter<Record<string, any>>
	@Event() smoothlyPickerOptionSelected: EventEmitter<string>
	componentDidLoad() {
		this.smoothlyPickerOptionLoaded.emit({ [this.name]: this.value })
	}
	@Listen("click")
	clickHandler() {
		this.smoothlyPickerOptionSelected.emit(this.name)
	}
	render() {
		return <slot></slot>
	}
}
