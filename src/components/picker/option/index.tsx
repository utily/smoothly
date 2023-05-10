import { Component, Element, Event, EventEmitter, h, Host, Prop, State } from "@stencil/core"
import { Option } from "../../../model"

@Component({
	tag: "smoothly-picker-option",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerOption {
	@Element() element: HTMLSmoothlyPickerOptionElement
	@Prop({ mutable: true, reflect: true }) selected = false
	@Prop({ mutable: true, reflect: true }) visible = true
	@Prop({ reflect: true }) labeled = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop() value: any
	@Prop({ reflect: true, mutable: true }) name: string
	@State() valueElement?: HTMLElement
	@Event() smoothlyPickerOptionLoaded: EventEmitter<Option>
	@Event() smoothlyPickerOptionChanged: EventEmitter<Option>
	get option(): Option {
		return {
			value: this.value,
			element: this.element,
			slotted: !this.element
				? []
				: Array.from(this.element.childNodes).reduce<Node[]>(
						(result, child) =>
							child instanceof HTMLElement && child.classList.contains("exclude")
								? result
								: [...result, child.cloneNode(true)],
						[]
				  ),
		}
	}
	componentWillLoad() {
		this.name = this.name ?? this.value
		this.smoothlyPickerOptionLoaded.emit(this.option)
	}
	clickHandler() {
		if (!this.readonly) {
			this.selected = !this.selected
			this.smoothlyPickerOptionChanged.emit(this.option)
		}
	}
	render() {
		return (
			<Host onClick={() => this.clickHandler()}>
				<div class={"exclude"}>
					<button type={"button"}>
						<smoothly-icon name={this.selected ? "checkbox-outline" : "square-outline"} />
					</button>
				</div>
				<div>
					<slot />
				</div>
				<div class={"exclude value"}>
					<span>{this.name}</span>
				</div>
			</Host>
		)
	}
}
