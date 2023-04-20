import { Component, Element, Event, EventEmitter, h, Host, Prop, State } from "@stencil/core"

export interface Option {
	name: string
	value: any
	selected: boolean
	slotted: Node[]
	show: () => void
	hide: () => void
	visible: () => boolean
}
@Component({
	tag: "smoothly-picker-option",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerOption {
	@Element() element: HTMLElement
	@Prop({ mutable: true, reflect: true }) multiple = false
	@Prop({ mutable: true, reflect: true }) selected = false
	@Prop({ mutable: true, reflect: true }) visible = true
	@Prop({ reflect: true }) labeled = false
	@Prop() value: any
	@Prop() name: string
	@State() valueElement?: HTMLElement
	@Event() smoothlyPickerOptionLoaded: EventEmitter<Option>
	@Event() smoothlyPickerOptionChanged: EventEmitter<Option>
	get option(): Option {
		const result = {
			name: this.name,
			value: this.value,
			selected: this.selected,
			slotted: !this.element
				? []
				: Array.from(this.element.childNodes).reduce<Node[]>(
						(result, child) =>
							child instanceof HTMLElement && child.classList.contains("exclude")
								? result
								: [...result, child.cloneNode(true)],
						[]
				  ),
			show: () => (this.visible = true),
			hide: () => (this.visible = false),
			visible: () => this.visible,
		}
		return result
	}
	componentWillLoad() {
		this.name = this.name ?? this.value
	}
	componentDidLoad() {
		this.smoothlyPickerOptionLoaded.emit(this.option)
	}
	clickHandler() {
		this.selected = !this.selected
		this.smoothlyPickerOptionChanged.emit(this.option)
	}
	render() {
		return (
			<Host onClick={() => this.clickHandler()}>
				<button type={"button"} class={"exclude"}>
					<smoothly-icon name={this.selected ? "checkbox-outline" : "square-outline"} />
				</button>
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
