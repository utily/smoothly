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
	@Prop({ mutable: true }) value: any
	@Prop({ reflectToAttr: true }) type: string = "text"
	@Prop({ mutable: true, reflectToAttr: true }) required: boolean
	@Prop({ mutable: true }) minLength: number = 0
	@Prop({ mutable: true }) maxLength: number = Number.POSITIVE_INFINITY
	@Prop({ mutable: true }) autocomplete: Autocomplete = "on"
	@Prop({ mutable: true }) pattern: RegExp | undefined
	@Prop({ mutable: true }) placeholder: string | undefined
	@Event() smoothlyChanged: EventEmitter<{ value: any }>
	@Watch("value")
	valueWatcher(value: any, before: any) {
		console.log(this.name + " changed")
		console.log(value)
		this.typeHandler.value = value
		if (value != before)
			this.smoothlyChanged.emit({ value })
	}
	private typeHandler: TypeHandler
	componentWillLoad() {
		this.typeHandler = TypeHandler.create(this)
	}
	hostData() {
		return { class: { "has-value": this.typeHandler.native.value } }
	}
	render() {
		const component = this.typeHandler.native
		return [
			<input
				name={ component.name }
				value={ component.value }
				type={ component.type }
				placeholder={ component.placeholder }
				required={ component.required }
				autocomplete={ component.autocomplete }
				pattern={ component.pattern && component.pattern.source }
				onFocus={ e => this.typeHandler.onFocus(e) }
				onClick={ e => this.typeHandler.onClick(e) }
				onKeyDown={ e => this.typeHandler.onKeyDown(e) }></input>,
			<label htmlFor={component.name}><slot/></label>,
		]
	}
}
