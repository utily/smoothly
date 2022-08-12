import { Component, Element, Event, EventEmitter, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-option",
	styleUrl: "style.scss",
	shadow: true,
})
export class SmoothlyOption {
	@Element() element: HTMLElement
	@Prop({ reflect: true }) aliases: string
	@Prop({ mutable: true, reflect: true }) dataHighlight = false
	@Prop({ mutable: true, reflect: true }) name: string
	@Prop({ mutable: true, reflect: true }) value: string
	@Prop({ mutable: true, reflect: true }) divider?: boolean = false
	@Prop() new: boolean
	@Event() optionHover: EventEmitter<{ value: any; name: string }>
	@Event() optionSelect: EventEmitter<{ value: any; name: string }>
	@Event() optionAdd: EventEmitter<{ name: string; value: string }>
	onHover(event: MouseEvent) {
		this.optionHover.emit({ name: this.name, value: this.value })
	}
	onSelect(event: UIEvent) {
		if (this.value)
			if (this.new)
				this.optionAdd.emit({ name: this.name, value: this.value })
			else
				this.optionSelect.emit({ name: this.name, value: this.value })
		else
			throw `smoothly-option ${this.element.innerHTML} lacks value-property and can therefore not be selected`
	}

	render() {
		return (
			<Host onMouseDown={(e: any) => this.onSelect(e)} onMouseOver={(e: MouseEvent) => this.onHover(e)}>
				<slot name="left"></slot>
				<div class="middle">{this.name}</div>
				<slot name="right"></slot>
			</Host>
		)
	}
}
