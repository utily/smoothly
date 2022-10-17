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
	@Event() radioItemSelectInternal: EventEmitter<Selected>

	componentWillLoad(): void | Promise<void> {
		this.selected && this.select(this.selected)
	}

	private select(selected = false) {
		this.radioItemSelectInternal.emit({
			value: this.value,
			selected: selected,
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
					<slot name="end"></slot>
				</header>
				<slot name="expansion"></slot>
			</Host>
		)
	}
}
