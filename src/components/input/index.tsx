import { Component, Event, EventEmitter, Prop, Watch } from "@stencil/core"
import { Autocomplete } from "./Autocomplete"
@Component({
	tag: "smoothly-input",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInput {
	@Prop() name: string
	@Prop({ mutable: true }) value: string
	@Prop() type: "text" | "email" = "text"
	@Prop() placeholder?: string
	@Prop({ mutable: true, reflectToAttr: true }) required: boolean
	@Prop({ mutable: true, reflectToAttr: true }) autocomplete: Autocomplete
	@Prop({ mutable: true, reflectToAttr: true }) pattern?: string
	@Event() valueChanged: EventEmitter<{ value: string }>
	@Watch("value")
	valueChangedWatcher(value: string) {
		this.valueChanged.emit(this)
	}
	protected async onInput(e: UIEvent) {
		if (e.target && (e.target as HTMLInputElement).value) {
			this.value = (e.target as HTMLInputElement).value
			if (e.bubbles)
				e.stopPropagation()
		}
	}
	hostData() {
		return { class: { "has-content": this.value && this.value.length > 0 } }
	}
	render() {
		return [
			<input
				name={this.name}
				value={this.value}
				type={this.type}
				placeholder={this.placeholder}
				required={this.required}
				autocomplete={this.autocomplete}
				pattern={this.pattern}
				onInput={ e => this.onInput(e as UIEvent) }></input>,
			<label htmlFor={this.name}><slot/></label>,
		]
	}
}
