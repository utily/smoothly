import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop } from "@stencil/core"
import { Color, Expand, Fill } from "../../model"
import { Data } from "./Data"

@Component({
	tag: "smoothly-submit",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySubmit {
	private button?: HTMLButtonElement
	get form(): HTMLFormElement | undefined {
		return (this.button && this.button.form) || undefined
	}
	@Prop({ mutable: true, reflect: true }) processing: boolean
	@Prop({ reflect: true }) color?: Color
	@Prop({ reflect: true }) expand?: Expand
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true }) disabled = false
	@Prop() prevent?: boolean
	@Event({ eventName: "submit" }) submitEvent: EventEmitter<Data>
	@Listen("click")
	async handleSubmit(event: UIEvent): Promise<void> {
		if (!this.processing) {
			this.processing = true
			if (this.prevent)
				event.preventDefault()
			const result: { [key: string]: string } = {}
			if (this.form) {
				const elements = this.form.elements
				for (let i = 0; i < elements.length; i++) {
					const element = elements.item(i)
					if (hasNameAndValue(element) && element.name)
						result[element.name] = element.value
				}
				// Overwrite values with values from smoothly-input
				const smoothlyInputs = this.form.getElementsByTagName("smoothly-input")
				for (let i = 0; i < smoothlyInputs.length; i++) {
					const element = smoothlyInputs.item(i)
					if (hasNameAndValue(element) && element.name)
						result[element.name] = element.value
				}
			}
			this.submitEvent.emit(Data.deepen(result))
			this.processing = false
		}
	}

	handleClick(e: MouseEvent) {
		this.disabled && e.stopImmediatePropagation()
	}

	@Method()
	async submit(): Promise<boolean> {
		let result: boolean
		if ((result = !!this.form))
			this.form.submit()
		return result
	}
	render() {
		return (
			<Host onClick={(e: MouseEvent) => this.handleClick(e)}>
				<smoothly-spinner active={this.processing}></smoothly-spinner>
				<button
					type="submit"
					disabled={this.disabled || this.processing}
					ref={(element: HTMLButtonElement) => (this.button = element)}>
					<slot></slot>
				</button>
			</Host>
		)
	}
}
function hasNameAndValue(element: any): element is { name: string; value: string } {
	return (
		typeof (element as { name?: string }).name == "string" && typeof (element as { value?: string }).value == "string"
	)
}
