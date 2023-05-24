import { State, Watch } from "@stencil/core"
import { Component, h, Host, Listen, Prop } from "@stencil/core"
import { Icon } from "../icon/Icon"

@Component({
	tag: "smoothly-form-controll",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyFormControll {
	@Prop({ reflect: true }) label?: string | HTMLElement
	@Prop() placeholder?: string
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

	private geCursor = () => {
		const type = this.child?.querySelector("input")?.getAttribute("type")
		switch (type) {
			case "file":
				return "pointer"
			default:
				return "text"
		}
	}

	render() {
		return (
			<Host style={{ cursor: this.geCursor() }}>
				<div>
					{(this.label || this.icon) && (
						<label class={this.focus ? "focus" : ""} slot="label" onClick={() => this.child?.click()}>
							{this.icon && <smoothly-icon size="tiny" name={this.icon} />}
							<span>{this.placeholder && !this.focus ? this.placeholder : this.label}</span>
						</label>
					)}
					<slot />
				</div>
				{/* <slot name="end" /> fundera om vi kan nyttja denna för input clear */}
			</Host>
		)
	}
}
