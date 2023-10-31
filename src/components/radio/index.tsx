import { Component, Event, EventEmitter, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-0-radio",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyRadio {
	@Prop() name: string
	@Prop() value: string
	@Prop({ mutable: true, reflect: true }) checked: boolean
	@Prop() tabIndex: number
	@Event() smoothlySelected!: EventEmitter<{ name: string; value: string }>

	protected async onInput(e: UIEvent): Promise<boolean> {
		if (e.target && (e.target as HTMLInputElement).value && (this.checked = (e.target as HTMLInputElement).checked))
			this.smoothlySelected.emit({ name: this.name, value: this.value })
		return true
	}
	render() {
		return [
			<input
				type="radio"
				name={this.name}
				id={this.value}
				tabindex={this.tabIndex}
				checked={this.checked}
				value={this.value}
				onChange={e => this.onInput(e as UIEvent)}
			/>,
			<label htmlFor={this.value}>
				<slot />
			</label>,
		]
	}
}
