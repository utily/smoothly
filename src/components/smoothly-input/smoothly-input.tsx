import { Component, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-input",
	styleUrl: "smoothly-input.css",
	scoped: true,
})
export class SmoothlyInput {
	@Prop() name: string
	@Prop({ mutable: true }) value: string
	@Prop() type: "text" | "email" = "text"
	@Prop() maxLength?: number
	@Prop() inputMode: string
	@Prop() tabIndex: number
	@Prop() placeholder?: string

	protected async onInput(e: UIEvent): Promise<boolean> {
		if (e.target && (e.target as HTMLInputElement).value)
			this.value = (e.target as HTMLInputElement).value
		return true
	}
	hostData() {
		return { class: { "has-content": this.value && this.value.length > 0 } }
	}
	// Placeholder animation
	render() {
		return [
			<input type={this.type} placeholder={this.placeholder} name={this.name} maxlength={this.maxLength} inputmode={this.inputMode} tabindex={this.tabIndex} value={this.value} onInput={ e => this.onInput(e as UIEvent) }></input>,
			<label htmlFor={this.name}><slot/></label>,
		]
	}
}
