import { Component, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-radio",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyRadio {
	@Prop() name: string
	@Prop() value: string
	@Prop({ mutable: true, reflectToAttr: true }) checked: boolean
	@Prop() tabIndex: number

	protected async onInput(e: UIEvent): Promise<boolean> {
		if (e.target && (e.target as HTMLInputElement).value)
			this.checked = (e.target as HTMLInputElement).checked
		return true
	}
	// Placeholder animation
	render() {
		return [
			<input type="radio" name={this.name} id={this.value} tabindex={this.tabIndex} checked={this.checked} value={this.value} onInput={ e => this.onInput(e as UIEvent) }/>,
			<label htmlFor={this.value}><slot /></label>,
		]
	}
}
