// tslint:disable-next-line: no-implicit-dependencies
import { Component, Event, EventEmitter, Prop, h } from "@stencil/core"

@Component({
	tag: "smoothly-select",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySelect {
	@Prop() options: string[]
	@Event() selectionChanged!: EventEmitter<string>
	optionSelected(e: CustomEvent<string>) {
		this.selectionChanged.emit(e.detail)
	}

	render() {
		return [
			<select onChange={ (e: CustomEvent<string>) => this.optionSelected(e) }>
				{ this.options.map(option => <option value={ option }>{ option }</option>) }
			</select>
		]
	}
}
