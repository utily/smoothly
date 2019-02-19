import { Component, State, Prop } from "@stencil/core"

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

	@State() focused: string = "form-group"

	protected async onInput(e: Event): Promise<boolean> {
		return true
	}

	// Placeholder animation
	private focusMe(e: any){
		this.focused = "form-group focused"
		e.target.classList.add("active")
		return e
	}
	private blurMe(e: any){
		const inputValue = e.target.value
		if (inputValue == "") {
			e.target.classList.remove("filled")
			e.target.classList.remove("active")
			this.focused = "form-group"
		} else {
			e.target.classList.add("filled")
			e.target.classList.remove("active")
		}
		return e
	}
	render() {
		return [
			<div class={ this.focused }>
				<label class="form-label" htmlFor={this.name}><slot/></label>
				<input type={this.type} class="form-input" placeholder={this.placeholder} name={this.name} maxlength={this.maxLength} inputmode={this.inputMode} tabindex={this.tabIndex} onFocus={e => { this.focusMe(e) } }  onBlur={ e => { this.blurMe(e) } } value={this.value} onInput={ e => { this.onInput(e) }}/>
			</div>,
		]
	}
}
