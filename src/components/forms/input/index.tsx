import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, Watch } from "@stencil/core"
import { Currency } from "isoly"
import { Icon } from "../../icon/Icon"
import { Colors, Input, Layout, Placement, Radius } from "../Input"

@Component({
	tag: "smoothly-input-new",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputNew implements Input {
	@Prop({ reflect: true }) name: string
	@Prop() type = "text"
	@Prop() minLength = 0
	@Prop() maxLength: number = Number.POSITIVE_INFINITY
	@Prop() autocomplete = true
	@Prop() pattern: RegExp | undefined
	@Prop() placeholder: string | undefined
	@Prop({ reflect: true }) required = false
	@Prop({ mutable: true, reflect: true }) value: any
	@Prop({ mutable: true }) disabled = false
	@Prop({ mutable: true, reflect: true }) readonly = false
	@Prop({ reflect: true }) currency?: Currency
	@Prop({ reflect: true }) editable = false
	@Prop({ reflect: true }) clearable = false
	@Prop({ reflect: true, mutable: true }) layout: Layout = "border"
	@Prop({ reflect: true, mutable: true }) placement: Placement = "float"
	@Prop({ reflect: true }) icon: Icon
	@Prop({ reflect: true }) label: Colors = "dark"
	@Prop({ reflect: true }) border: Colors = "dark"
	@Prop({ reflect: true }) radius: Radius = "default"
	@Prop() fill: Colors
	@Prop() info: string | HTMLElement
	@Prop({ reflect: true, mutable: true }) focused = false
	@Event() smoothlyChange: EventEmitter<Record<string, any>>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLoad: EventEmitter
	@Element() element: HTMLSmoothlyInputNewElement
	private input: HTMLSmoothlyInputBaseElement

	componentWillLoad() {
		this.smoothlyInputLoad.emit()
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	@Watch("value")
	handleValue(value: any, pre: any) {
		if (value != pre)
			this.smoothlyChange.emit({ [this.name]: this.value })
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	@Method()
	async clear(): Promise<void> {
		this.input.clear()
		this.value = null
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

	render() {
		return (
			<Host>
				<div class="input-container" onClick={() => this.input.click()}>
					<label htmlFor={this.name}>
						<slot />
					</label>
					<smoothly-input-base
						focused={this.focused}
						onFocus={() => (this.focused = true)}
						onBlur={() => (this.focused = false)}
						onInput={(e: CustomEvent) => (this.value = e.detail.value ? e.detail.value : null)}
						name={this.name}
						type={this.type}
						placeholder={Input.placeholder(this.placement, this.value, this.focused) ? this.placeholder : undefined}
						required={this.required}
						autocomplete={this.autocomplete}
						disabled={this.disabled}
						readonly={this.readonly}
						pattern={this.pattern}
						value={this.value}
						ref={(el: HTMLSmoothlyInputBaseElement) => (this.input = el)}
					/>
					<smoothly-icon
						class="input-icon"
						color={this.fill}
						onClick={() => Input.onClickIcon(this.value, this.editable, this.clearable, this.readonly, this.element)}
						size="tiny"
						name={Input.icon(this.value, this.editable, this.clearable, this.readonly, this.icon)}
					/>
				</div>

				{this.info && <div class="input-info">{this.info}</div>}
			</Host>
		)
	}
}
