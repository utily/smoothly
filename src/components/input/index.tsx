import { Component, Event, EventEmitter, Prop, Watch } from "@stencil/core"
import { TypeHandler } from "./TypeHandler"
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
	private typeHandler = TypeHandler.create(this)
	protected async onInput(e: UIEvent) {
		if (e.target && (e.target as HTMLInputElement).value) {
			this.value = (e.target as HTMLInputElement).value
			if (e.bubbles)
				e.stopPropagation()
		}
	}
	hostData() {
		console.log("hostData " + this.value)
		return { class: { "has-value": this.value && this.value.length > 0 } }
	}
	render() {
		return [
			<input
				name={this.name}
				value={this.typeHandler.value}
				type={this.typeHandler.type}
				placeholder={this.typeHandler.placeholder}
				required={this.required}
				autocomplete={this.typeHandler.autocomplete}
				pattern={ this.typeHandler.pattern && this.typeHandler.pattern.source }
				onKeyDown={ e => this.typeHandler.onKeyDown(e) }
				onClick={ e => this.typeHandler.onClick(e) }></input>,
			<label htmlFor={this.name}><slot/></label>,
		]
	}
}
