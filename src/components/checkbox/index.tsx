import { Component, Event, EventEmitter, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-checkbox",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyCheckbox {
	@Prop() name: string
	@Prop() value: string
	@Prop() title: string
	@Prop({ mutable: true, reflectToAttr: true }) checked: boolean
	@Event() smoothlyChecked!: EventEmitter<{ name: string, value: string }>

	protected async onInput(e: UIEvent): Promise<boolean> {
		if (e.target && (e.target as HTMLInputElement).value && (this.checked = (e.target as HTMLInputElement).checked))
			this.smoothlyChecked.emit({ name: this.name, value: this.value })
		return true
	}

	render() {
		return [
			<input type="checkbox" name={ this.name } value={ this.value } title={ this.title } checked={ this.checked } onChange={ e => this.onInput(e as UIEvent) }/>,
		]
	}
}
