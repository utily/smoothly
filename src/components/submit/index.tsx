import { Component, Event, EventEmitter, Prop, Listen, h, Method } from "@stencil/core"
import { Color, Expand, Fill } from "smoothly-model"

@Component({
	tag: "smoothly-submit",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySubmit {
	private button?: HTMLButtonElement
	get form(): HTMLFormElement | undefined { return this.button && this.button.form || undefined }
	@Prop({ mutable: true, reflectToAttr: true }) processing: boolean
	@Prop({ reflectToAttr: true }) color?: Color
	@Prop({ reflectToAttr: true }) expand?: Expand
	@Prop({ reflectToAttr: true }) fill?: Fill
	@Prop() prevent?: boolean
	@Event({ eventName: "submit" }) submitEvent: EventEmitter<{ [key: string]: string }>
	@Listen("click")
	async handleSubmit(event: UIEvent): Promise<void> {
		if (!this.processing) {
			this.processing = true
			if (this.prevent)
				event.preventDefault()
			const result: { [key: string]: string } = {}
			if (this.form && this.form.elements) {
				const elements = this.form.elements
				for (let i = 0; i < elements.length; i++) {
					const element = elements.item(i)
					if (hasNameAndValue(element) && element.name)
						result[element.name] = element.value
				}
			}
			const innerEvent = this.submitEvent.emit(result)
			console.log("smoothly-submit", innerEvent)
			this.processing = false
		}
	}
	@Method()
	async submit(): Promise<boolean> {
		let result: boolean
		if (result = !!this.form)
			this.form.submit()
		return result
	}
	render() {
		return [
			<smoothly-spinner active={ this.processing }></smoothly-spinner>,
			<button type="submit" disabled={ this.processing } ref={ (element: HTMLButtonElement) => this.button = element }><slot></slot></button>,
		]
	}
}
function hasNameAndValue(element: any): element is { name: string, value: string } {
	return typeof((element as { name?: string }).name) == "string" && typeof((element as { value?: string }).value) == "string"
}
