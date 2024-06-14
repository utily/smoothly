import { Component, Element, Event, EventEmitter, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-0-option",
	styleUrl: "style.css",
	shadow: true,
})
export class Smoothly0Option {
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
			throw `smoothly-0-option ${this.element.innerHTML} lacks value-property and can therefore not be selected`
	}

	render() {
		return (
			<Host onMouseDown={(e: any) => this.onSelect(e)} onMouseOver={(e: MouseEvent) => this.onHover(e)}>
				{this.toggle && <smoothly-0-icon name={this.checked ? "checkbox" : "square-outline"}></smoothly-0-icon>}
				<div class="name">{this.name}</div>
				<smoothly-0-quiet>
					<slot name="hint"></slot>
				</smoothly-0-quiet>
			</Host>
		)
	}
}
