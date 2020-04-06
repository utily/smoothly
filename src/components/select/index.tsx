// tslint:disable-next-line: no-implicit-dependencies
import { Component, Event, EventEmitter, Prop, h } from "@stencil/core"

@Component({
	tag: "smoothly-select",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySelect {
	@Prop() identifier: string
	@Event() selectionChanged!: EventEmitter<{ identifier: string, value: string }>
	optionSelected() {
		this.selectionChanged.emit({ identifier: this.identifier, value: (document.getElementById(this.identifier) as HTMLSelectElement)?.value })
	}

	render() {
		return [
			<select id={ this.identifier } onChange={ () => this.optionSelected() }>
				<slot></slot>
			</select>
		]
	}
}
