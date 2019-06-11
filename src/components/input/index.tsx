import { Component, Event, EventEmitter, Prop, Watch, h } from "@stencil/core"
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
	@Prop({ mutable: true, reflectToAttr: true }) required: boolean = false
	@Prop({ mutable: true }) minLength: number = 0
	@Prop({ mutable: true }) maxLength: number = Number.POSITIVE_INFINITY
	@Prop({ mutable: true }) autocomplete: Autocomplete = "on"
	@Prop({ mutable: true }) pattern: RegExp | undefined
	@Prop({ mutable: true }) placeholder: string | undefined
	@Event() smoothlyChanged: EventEmitter<{ name: string, value: any }>
	@Watch("value")
	valueWatcher(value: any, before: any) {
		if (this.typeHandler)
			this.typeHandler.value = value
		if (value != before)
			this.smoothlyChanged.emit({ name: this.name, value })
	}
	private typeHandler?: TypeHandler
	componentWillLoad() {
		this.typeHandler = TypeHandler.create(this)
	}
	hostData() {
		return { class: { "has-value": this.typeHandler && this.typeHandler.native.value } }
	}
	render() {
		let result: any[] = []
		if (this.typeHandler) {
			const component = this.typeHandler.native
			result = [
				<input
					name={ this.name }
					value={ component.value }
					type={ component.type }
					placeholder={ component.placeholder }
					required={ component.required }
					autocomplete={ component.autocomplete }
					pattern={ component.pattern && component.pattern.source }
					onFocus={ e => { if (this.typeHandler) this.typeHandler.onFocus(e) } }
					onClick={ e => { if (this.typeHandler) this.typeHandler.onClick(e) } }
					onKeyDown={ e => { if (this.typeHandler) this.typeHandler.onKeyDown(e) } }></input>,
				<label htmlFor={this.name}><slot/></label>,
			]
		}
		return result
	}
}
