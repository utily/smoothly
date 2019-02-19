import { Component, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-input",
	styleUrl: "smoothly-input.css",
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
	// Placeholder animation
	render() {
		return [
			<div class={ this.value && this.value.length > 0 ? "has-content" : "" }>
				<label htmlFor={this.name}><slot/></label>
				<input type={this.type} placeholder={this.placeholder} name={this.name} maxlength={this.maxLength} inputmode={this.inputMode} tabindex={this.tabIndex} value={this.value} onInput={ e => this.onInput(e as UIEvent) }/>
			</div>,
		]
	}
}
