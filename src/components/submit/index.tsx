import { Component, Event, EventEmitter, Prop, Listen } from "@stencil/core"
import { Color } from "../../Color"
import { Expand } from "../../Expand"
import { Fill } from "../../Fill"

@Component({
	tag: "smoothly-submit",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySubmit {
	@Prop({ mutable: true, reflectToAttr: true }) processing: boolean
	@Prop({ reflectToAttr: true }) color?: Color
	@Prop({ reflectToAttr: true }) expand?: Expand
	@Prop({ reflectToAttr: true }) fill?: Fill
	@Event() submit: EventEmitter<{ [key: string]: string }>
	@Listen("click")
	async handleSubmit(event: UIEvent): Promise<void> {
		if (!this.processing) {
			this.processing = true
			const result: { [key: string]: string } = {}
			const target = event.target as HTMLButtonElement
			if (target.form && target.form.elements) {
				const elements = target.form.elements
				for (let i = 0; i < elements.length; i++) {
					const element = elements.item(i)
					if (hasNameAndValue(element) && element.name)
						result[element.name] = element.value
				}
			}
			event.preventDefault()
			this.processing = this.submit.emit(result).returnValue
		}
	}

	render() {
		return [
			<smoothly-spinner active={ this.processing }></smoothly-spinner>,
			<button disabled={ this.processing }><slot></slot></button>,
		]
	}
}
function hasNameAndValue(element: any): element is { name: string, value: string } {
	return typeof((element as { name?: string }).name) == "string" && typeof((element as { value?: string }).value) == "string"
}
