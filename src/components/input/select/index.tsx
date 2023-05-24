import { Component, Event, EventEmitter, Fragment, h, Host, Prop, State, Watch } from "@stencil/core"

export type Options = { label?: string; value: string }
@Component({
	tag: "smoothly-input-select",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputSelect {
	private random = window.crypto.randomUUID()
	@Prop() name: string
	@Prop({ mutable: true }) value?: string | string[]
	@Prop() options: Options[]
	@Prop({ reflect: true }) filterable = false
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) required = false
	@Prop({ reflect: true }) multiple = false
	@State() filter: string
	@Event() smoothlyBlur: EventEmitter<void>
	@Event() smoothlyFocus: EventEmitter<void>
	@Event() smoothlyInput: EventEmitter<Record<string, string | string[] | undefined>>
	@Event() smoothlyChange: EventEmitter<Record<string, string | string[] | undefined>>
	@Event() smoothlyFormInput: EventEmitter<void>

	componentWillLoad() {
		this.smoothlyFormInput.emit()
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	@Watch("value")
	onChangeValue(value: File, pre: File | undefined) {
		if (value != pre)
			this.smoothlyChange.emit({ [this.name]: this.value })
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	onFocus() {
		this.smoothlyFocus.emit()
	}

	onBlur() {
		this.smoothlyBlur.emit()
	}

	onInput(e: KeyboardEvent) {
		const element = e.target as HTMLInputElement
		const match = this.options.filter(option => (option.label || option.value) === element.value)[0]
		if (match)
			this.value = match.value
		else
			this.value = undefined
		this.filter = element.value
	}

	onSelect(e: Event) {
		const element = e.target as HTMLOptionElement
		this.value = element.value
	}

	controllInput() {
		if (!this.value && this.filter)
			this.filter = ""
	}

	render() {
		return (
			<Host>
				{this.filterable && !this.multiple ? (
					<Fragment>
						<input
							onInput={(e: KeyboardEvent) => this.onInput(e)}
							onFocus={() => this.onFocus()}
							onBlur={() => {
								this.controllInput()
								this.onBlur()
							}}
							value={this.filter}
							name={this.name}
							disabled={this.disabled}
							required={this.required}
							type="text"
							list={this.random}
						/>
						<datalist id={this.random}>
							{this.options.map(option => (
								<option selected={option.value === this.value} value={option.value} />
							))}
						</datalist>
					</Fragment>
				) : (
					<select
						onChange={e => this.onSelect(e)}
						name={this.name}
						disabled={this.disabled}
						required={this.required}
						multiple={this.multiple}
						onFocus={() => this.onFocus()}
						onBlur={() => this.onBlur()}>
						{!this.value && <option value="" style={{ display: "none" }}></option>}
						{this.options.map(option => (
							<option
								selected={Array.isArray(this.value) ? this.value.includes(option.value) : option.value === this.value}
								value={option.value}>
								{option.label || option.value}
							</option>
						))}
					</select>
				)}
			</Host>
		)
	}
}
