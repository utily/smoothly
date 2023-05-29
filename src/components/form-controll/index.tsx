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

	@Listen("smoothlyInput")
	onInput(e: CustomEvent<Record<string, any>>) {
		if (e.target && !this.child)
			this.child = e.target as HTMLElement
		this.hasValue = Object.values(e.detail).filter(value => Boolean(value)).length > 0
	}

	@Watch("hasValue")
	onChangeValue() {
		if (this.hasValue)
			this.focus = true
	}

	clear() {
		if (Clearable.is(this.child))
			this.child?.clear()
	}

	render() {
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
				{this.clearable && this.hasValue ? (
					<span class="end" onClick={() => this.clear()}>
						<smoothly-icon size="tiny" name="close" />
					</span>
				) : (
					<span class="end">
						<slot name="end" />
					</span>
				)}
			</Host>
		)
	}
}
