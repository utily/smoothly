import { State, Watch } from "@stencil/core"
import { Component, h, Host, Listen, Prop } from "@stencil/core"
import { Icon } from "../icon/Icon"
import { Clearable } from "../input/Clearable"

@Component({
	tag: "smoothly-form-controll",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyFormControll {
	@Prop({ reflect: true }) label?: string | HTMLElement
	@Prop() placeholder?: string
	@Prop({ reflect: true }) clearable = false
	@Prop({ reflect: true }) icon?: Icon
	@Prop({ reflect: true }) endIcon?: Icon
	@State() focus = false
	@State() hasValue?: boolean
	private child?: HTMLElement

	@Listen("smoothlyFocus")
	onFocus() {
		this.focus = true
	}

	@Listen("smoothlyBlur")
	onBlure() {
		if (!this.hasValue)
			this.focus = false
	}

	@Listen("smoothlyFormInputLoad")
	onFormINputLoad(e: Event) {
		if (e.target && !this.child)
			this.child = e.target as HTMLElement
	}

	@Listen("smoothlyInput")
	onInput(e: CustomEvent<Record<string, any>>) {
		this.hasValue = Object.values(e.detail).filter(value => Boolean(value)).length > 0
		console.log("listen:", this.hasValue)
		console.log("listen:", this.focus)
	}

	@Watch("hasValue")
	onChangeValue() {
		if (this.hasValue)
			this.focus = true
		console.log("cb:", this.hasValue)
		console.log("cb:", this.focus)
	}

	onClickEndIcon() {
		if (this.clearable && this.hasValue) {
			if (Clearable.is(this.child))
				this.child?.clear()
		} else {
			const element = this.child?.querySelector("fieldset")
			if (element)
				element.click()
			else
				this.child?.querySelector("input")?.focus()
		}
	}

	render() {
		console.log(this.child?.getAttribute("name"))
		console.log("render:", this.hasValue)
		console.log("render:", this.focus)
		console.log(this.clearable && this.hasValue ? "close" : this.endIcon ?? "empty")
		return (
			<Host>
				<div>
					{(this.label || this.icon) && (
						<label class={this.focus ? "focus" : ""} slot="label">
							{this.icon && <smoothly-icon size="tiny" name={this.icon} />}
							<span>{this.placeholder && !this.focus ? this.placeholder : this.label}</span>
						</label>
					)}
					<slot />
				</div>
				<span class="end" onClick={() => this.onClickEndIcon()}>
					<smoothly-icon size="tiny" name={this.clearable && this.hasValue ? "close" : this.endIcon ?? "empty"} />
				</span>
			</Host>
		)
	}
}
