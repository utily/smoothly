import { Component, Event, EventEmitter, Prop, Watch } from "@stencil/core"
import { Type } from "./Type"
import { Autocomplete } from "./browser"
@Component({
	tag: "smoothly-input",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInput {

	@Prop() name: string
	@Prop({ mutable: true }) value: string
	@Prop({ reflectToAttr: true }) type: string = "text"
	@Prop({ mutable: true, reflectToAttr: true }) required: boolean
	@Prop({ mutable: true }) minLength: number = 0
	@Prop({ mutable: true }) maxLength: number = Number.POSITIVE_INFINITY
	@Prop({ mutable: true }) autocomplete: Autocomplete
	@Prop({ mutable: true }) pattern: RegExp | undefined
	@Prop({ mutable: true }) placeholder: string | undefined
	@Event() valueChange: EventEmitter<{ value: string }>
	@Watch("value")
	valueChangeWatcher(value: string) {
		this.valueChange.emit(this)
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
		const type = Type.create(this)
		return [
			<input
				name={this.name}
				value={type.value}
				type={type.type}
				placeholder={type.placeholder}
				required={this.required}
				autocomplete={type.autocomplete}
				pattern={ type.pattern && type.pattern.source }
				onKeyDown={ e => type.onKeyDown(e) }
				onClick={ e => type.onClick(e) }></input>,
			<label htmlFor={this.name}><slot/></label>,
		]
	}
}
