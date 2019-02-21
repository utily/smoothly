import { Component, Event, EventEmitter, State, Prop, Listen } from "@stencil/core"

@Component({
	tag: "smoothly-submit",
	styleUrl: "smoothly-submit.css",
	scoped: true,
})
export class SmoothlySubmit {
	@Prop({ mutable: true }) processing: boolean
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
			this.processing = !this.submit.emit(result).returnValue
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
