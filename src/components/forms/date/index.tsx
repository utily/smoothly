import { Component, Element, Event, EventEmitter, Fragment, h, Host, Method, Prop, Watch } from "@stencil/core"
import { Date } from "isoly"
import { Icon } from "../../icon/Icon"
import Calendar from "../calendar/Calendar"
import { Colors, Input, Layout, Placement, Radius } from "../Input"

@Component({
	tag: "smoothly-date-new",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDateNew implements Input {
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true, reflect: true }) value?: string | null
	@Prop({ mutable: true, reflect: true }) focused: boolean
	@Prop({ reflect: true }) required = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop() placeholder: string | undefined
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
	@Prop({ mutable: true }) max: Date
	@Prop({ mutable: true }) min: Date
	@Prop({ mutable: true }) disabled: boolean
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
				<div class="date-wrapper">
					<div class="input-container" onClick={() => this.input.click()}>
						<label htmlFor={this.name}>
							<slot />
						</label>
						<smoothly-input-base
							focused={this.focused}
							onFocus={() => {
								if (!this.readonly)
									this.focused = true
							}}
							onInput={(e: CustomEvent) => (this.value = e.detail.value ? e.detail.value : null)}
							name={this.name}
							type="date"
							placeholder={Input.placeholder(this.placement, this.value, this.focused) ? this.placeholder : undefined}
							required={this.required}
							disabled={this.disabled}
							readonly={this.readonly}
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

					{this.focused && !this.disabled && (
						<Fragment>
							<div class="date-backdrop" onClick={() => (this.focused = false)}></div>
							<div class="calendar-wrapper">
								<smoothly-calendar-new
									doubleInput={false}
									value={this.value ?? Calendar.getCurrentDateString()}
									onValueChanged={(event: CustomEvent) => {
										this.value = event.detail
										event.stopPropagation()
									}}
									onDateSet={e => {
										this.focused = false
										e.stopPropagation()
									}}
									max={this.max}
									min={this.min}
								/>
							</div>
						</Fragment>
					)}
				</div>
			</Host>
		)
	}
}