// tslint:disable-next-line: no-implicit-dependencies
import { Component, Event, EventEmitter, Prop, h } from "@stencil/core"
// import { Currency, Language } from "isoly"

@Component({
	tag: "smoothly-select",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySelect {
	// @Prop() options: (string | Currency | Language)[]
	@Prop() identifier: string
	// @Prop() selected: string | Currency | Language
	@Event() selectionChanged!: EventEmitter<{ identifier: string, value: string }>
	onComponentWillLoad() {
		console.log("hello!?")
		console.log("selected", (document.getElementById(this.identifier) as HTMLSelectElement)?.value)
	}
	optionSelected() {
		this.selectionChanged.emit({ identifier: this.identifier, value: (document.getElementById(this.identifier) as HTMLSelectElement)?.value })
	}

	render() {
		return [
			<select id={ this.identifier } onChange={ () => this.optionSelected() }>
				{/* { this.options.map(option => option == this.selected ? <option value={ option } selected></option> : <option value={ option }>{ option }</option>) } */}
				{/* { this.options.map(option => <option value={ option }>{ option }</option>) } */}
				<slot></slot>
			</select>
		]
	}
}
