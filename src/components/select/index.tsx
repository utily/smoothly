import { Component, Event, EventEmitter, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-0-select",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySelect {
	@Prop() identifier: string
	@Prop({ reflect: true }) background?: string
	private selectElement?: HTMLSelectElement
	@Prop({ mutable: true }) value: string
	@Event() selectionChanged!: EventEmitter<{ identifier: string; value: string }>
	optionSelected() {
		if (this.selectElement)
			this.selectionChanged.emit({ identifier: this.identifier, value: (this.value = this.selectElement.value) })
	}
	componentDidLoad() {
		if (this.selectElement)
			this.value = this.selectElement?.value
	}

	render() {
		return [
			<select
				ref={e => (this.selectElement = e)}
				id={this.identifier}
				onChange={() => this.optionSelected()}
				style={{ background: this.background }}>
				<slot></slot>
			</select>,
		]
	}
}
