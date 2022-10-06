import { Component, ComponentWillLoad, Event, EventEmitter, h, Host, Prop } from "@stencil/core"
import { Selected } from "../Selected"

@Component({
	tag: "smoothly-radio-button-item",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyRadioButtonItem implements ComponentWillLoad {
	@Prop() value: any
	@Prop({ reflect: true, mutable: true }) selected: boolean
	@Prop() expansion = false
	@Event() radioSelect: EventEmitter<Selected>

	componentWillLoad(): void | Promise<void> {
		this.select(this.selected)
	}

	private select(selected = false) {
		this.radioSelect.emit({
			value: this.value,
			selected,
			select: s => (this.selected = s),
		})
	}

	render() {
		return (
			<Host>
				<header onClick={() => this.select(!this.selected)}>
					<smoothly-icon
						color={this.selected ? "success" : "medium"}
						fill="solid"
						name={this.selected ? "checkmark-circle" : "ellipse-outline"}
						size="tiny"
						toolTip="Select"></smoothly-icon>
					<slot></slot>
				</header>
				<aside class={this.expansion ? "" : "hide"}>
					<slot name="expansion"></slot>
				</aside>
			</Host>
		)
	}
}
