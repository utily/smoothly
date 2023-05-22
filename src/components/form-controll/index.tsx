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

	render() {
		return (
			<Host style={{ cursor: this.child?.style.cursor || "text" }}>
				<slot name="start" />
				<div>
					{(this.label || this.icon) && (
						<label class={this.focus ? "focus" : ""} slot="label" onClick={() => this.child?.click()}>
							{this.icon && <smoothly-icon size="tiny" name={this.icon} />}
							<span>{this.label}</span>
						</label>
					)}
					<slot />
				</div>
				<slot name="end" />
			</Host>
		)
	}
}

// lägg clear som en slot i form controll om den ska var en "icon"
