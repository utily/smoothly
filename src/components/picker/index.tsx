import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State } from "@stencil/core"

@Component({
	tag: "smoothly-picker",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPicker {
	@Element() element: HTMLElement
	@Prop({ mutable: true, reflect: true }) open = false
	@Prop() multiple: true
	@State() options: Record<string, any> = {}
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyChange: EventEmitter<Record<string, any>>
	@Listen("smoothlyPickerOptionLoaded")
	optionLoadedHandler(event: CustomEvent<Record<string, any>>) {
		event.stopPropagation()
		this.options = { ...this.options, ...event.detail }
	}
	@Listen("smoothlyPickerOptionSelected")
	optionsSelected(event: CustomEvent<string>) {
		event.stopPropagation()
		this.smoothlyInput.emit({ [event.detail]: this.options[event.detail] })
		this.smoothlyChange.emit({ [event.detail]: this.options[event.detail] })
	}
	render() {
		return (
			<Host>
				<div class={"selector"}>
					<div class={"selected"}>
						{this.element.}
					</div>
					<smoothly-icon name={this.open ? "chevron-down-outline" : "chevron-back-outline"} />
				</div>
				<div class={"menu"}>
					<slot />
				</div>
			</Host>
		)
	}
}
