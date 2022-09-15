import { Component, Element, Event, EventEmitter, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-option",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyOption {
	@Element() element: HTMLElement
	@Prop({ reflect: true }) aliases: string
	@Prop({ mutable: true, reflect: true }) dataHighlight = false
	@Prop({ mutable: true, reflect: true }) name: string
	@Prop({ mutable: true, reflect: true }) value: string
	@Prop({ mutable: true, reflect: true }) divider?: boolean = false
	@Prop() checkbox: boolean
	@Prop() new?: boolean
	@Prop() toggle = false
	@Prop({ mutable: true }) checked = false
	@Event() optionHover: EventEmitter<{ value: any; name: string }>
	@Event() optionSelect: EventEmitter<{ value: any; name: string }>
	@Event() optionUnselect: EventEmitter<{ value: any; name: string }>
	@Event() optionAdd: EventEmitter<{ name: string; value: string }>
	onHover(event: MouseEvent) {
		this.optionHover.emit({ name: this.name, value: this.value })
	}
	onSelect(event: UIEvent) {
		if (this.value) {
			this.new
				? this.optionAdd.emit({ name: this.name, value: this.value })
				: !this.toggle || (this.toggle && !this.checked)
				? this.optionSelect.emit({ name: this.name, value: this.value })
				: this.optionUnselect.emit({ name: this.name, value: this.value })
			this.toggle && (this.checked = !this.checked)
		} else
			throw `smoothly-option ${this.element.innerHTML} lacks value-property and can therefore not be selected`
	}

	render() {
		return (
			<Host onMouseDown={(e: any) => this.onSelect(e)} onMouseOver={(e: MouseEvent) => this.onHover(e)}>
				{this.toggle && <smoothly-icon name={this.checked ? "checkbox" : "square-outline"}></smoothly-icon>}
				<div class="name">{this.name}</div>
				<smoothly-quiet>
					<slot name="hint"></slot>
				</smoothly-quiet>
			</Host>
		)
	}
}
