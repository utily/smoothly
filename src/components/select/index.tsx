// tslint:disable-next-line: no-implicit-dependencies
import { Component, Event, EventEmitter, Prop, h } from "@stencil/core"
import { Currency, Language } from "isoly"

@Component({
	tag: "smoothly-select",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySelect {
	@Prop() options: (string | Currency | Language)[]
	@Event() selectionChanged!: EventEmitter<string>
	optionSelected() {
		this.selectionChanged.emit((document.getElementById("select") as HTMLSelectElement)?.value)
	}

	render() {
		return [
			<select id="select" onChange={ () => this.optionSelected() }>
				{ this.options.map(option => <option value={ option }>{ option }</option>) }
			</select>
		]
	}
}
