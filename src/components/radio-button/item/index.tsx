import { Component, ComponentWillLoad, Event, EventEmitter, h, Host, Prop } from "@stencil/core"
import { Color } from "../../../model"
import { Selected } from "../Selected"

@Component({
	tag: "smoothly-0-radio-button-item",
	styleUrl: "style.css",
	scoped: true,
})
export class Smoothly0RadioButtonItem implements ComponentWillLoad {
	@Prop() value: any
	@Prop({ reflect: true, mutable: true }) selected: boolean
	@Prop({ reflect: true }) color: Color = "medium"
	@Event() radioItemSelectInternal: EventEmitter<Selected>
	@Prop() iconColor: Color = "medium"
	@Prop({ reflect: true, mutable: true }) disabled: boolean

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
					<smoothly-0-icon
						color={this.selected ? "success" : this.iconColor}
						fill="outline"
						name={this.selected ? "checkmark-circle" : "ellipse-outline"}
						size="tiny"
						toolTip="Select"></smoothly-0-icon>
					<slot></slot>
					<slot name="end"></slot>
				</header>
				<slot name="expansion"></slot>
			</Host>
		)
	}
}
