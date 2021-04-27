import { Component, Element, Event, EventEmitter, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-option",
	styleUrl: "style.scss",
	shadow: true,
})
export class SmoothlyOption {
	@Element() element: HTMLElement
	@Prop({ mutable: true, reflect: true }) dataHighlight = false
	@Prop({ mutable: true, reflect: true }) name: string
	@Prop({ mutable: true, reflect: true }) value: string
	@Event() optionHover: EventEmitter<{ name: string; value: string }>
	@Event() optionSelect: EventEmitter<{ name: string; value: string }>
	onHover(event: MouseEvent) {
		this.optionHover.emit({ name: this.name, value: this.value })
	}
	onSelect(event: UIEvent) {
		if (this.value)
			this.optionSelect.emit({ name: this.name, value: this.value })
		else
			throw `smoothly-option ${this.element.innerHTML} lacks value-property and can therefore not be selected`
	}

	render() {
		return (
			<Host onMouseDown={(e: any) => this.onSelect(e)} onMouseOver={(e: MouseEvent) => this.onHover(e)}>
				<div>{this.name}</div>
				<div>
					<slot></slot>
				</div>
			</Host>
		)
	}
}
