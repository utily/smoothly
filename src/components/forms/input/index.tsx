import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop } from "@stencil/core"
import { Currency } from "isoly"
import { Icon } from "../../icon/Icon"
import { Input, Layout, Placement } from "../Input"

@Component({
	tag: "smoothly-input-new",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputNew implements Input {
	@Prop() name: string
	@Prop() type = "text"
	@Prop() required = false
	@Prop() minLength = 0
	@Prop() maxLength: number = Number.POSITIVE_INFINITY
	@Prop() autocomplete = true
	@Prop() pattern: RegExp | undefined
	@Prop() placeholder: string | undefined
	@Prop({ mutable: true, reflect: true }) value: any
	@Prop({ mutable: true }) disabled = false
	@Prop({ mutable: true, reflect: true }) readonly = false
	@Prop({ reflect: true }) currency?: Currency
	@Prop({ reflect: true }) editable = false
	@Prop({ reflect: true }) clearable = false
	@Prop({ reflect: true }) layout: Layout = "border"
	@Prop({ reflect: true }) placement: Placement = "float"
	@Prop({ reflect: true }) icon: Icon
	@Prop({ reflect: true, mutable: true }) focused = false
	@Event() smoothlyBlur: EventEmitter<void>
	@Event() smoothlyChange: EventEmitter<Record<string, any>>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	private inputElement: HTMLSmoothlyInputBaseElement
	private iconElement: HTMLSmoothlyIconElement

	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}

	@Method()
	async setReadonly(readonly: boolean): Promise<void> {
		this.readonly = readonly
	}

	@Method()
	async setStyle(layout: Layout, placement: Placement): Promise<void> {
		this.layout = layout
		this.placement = placement
	}

	@Listen("click")
	onClickElement(e: Event) {
		console.log("onclick icon", e.target) // Fortsätt här, kolla varför icon elementet visar en svg och inte smoothly-icon

		if (e.target === this.iconElement)
			this.onClickIcon()
		else
			e.target !== this.inputElement
		this.inputElement.click()
	}

	onClickIcon() {
		// Lägg i Input namespace
		if (this.editable && this.readonly) {
			this.setReadonly(false)
		} else if (this.clearable && this.value) {
			this.clear()
		} else {
			this.inputElement.click()
		}
	}

	getIcon() {
		// Lägg i Input namespace
		let icon: Icon | "empty" = this.icon ?? "empty"
		if (this.editable && this.readonly)
			icon = "create"
		else if (this.clearable && this.value && !this.readonly)
			icon = "close"
		return icon
	}

	render() {
		return (
			<Host>
				<div class="input-container">
					<label htmlFor={this.name}>
						<slot />
					</label>
					<smoothly-input-base
						onFocus={() => (this.focused = true)}
						onBlur={() => (this.focused = false)}
						onInput={(e: CustomEvent) => (this.value = e.detail.value ? e.detail.value : undefined)}
						name={this.name}
						type={this.type}
						placeholder={Input.placeholder(this.placement, this.value, this.focused) ? this.placeholder : undefined}
						required={this.required}
						autocomplete={this.autocomplete}
						disabled={this.disabled}
						readonly={this.readonly}
						pattern={this.pattern}
						value={this.value}
						ref={(el: HTMLSmoothlyInputBaseElement) => (this.inputElement = el)}
					/>
					<smoothly-icon
						ref={(el: HTMLSmoothlyIconElement) => (this.iconElement = el)}
						size="tiny"
						name={this.getIcon()}
					/>
				</div>
			</Host>
		)
	}
}
