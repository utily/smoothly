import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from "@stencil/core"

export type Options = { label?: string; value: string }
@Component({
	tag: "smoothly-input-select",
	styleUrl: "style.scss",
	scoped: true,
})
export class SmoothlyInputSelect {
	@Prop() name: string
	@Prop({ mutable: true }) value?: string | string[]
	@Prop() options: Options[]
	@Prop({ reflect: true }) filterable = false
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) required = false
	@Prop({ reflect: true }) multiple = false
	@State() focused = false
	@State() isHovered = false
	@State() filter: string
	@State() optionFiltered: Options[]
	@State() current: HTMLDivElement | undefined
	@Event() smoothlyBlur: EventEmitter<void>
	@Event() smoothlyFocus: EventEmitter<void>
	@Event() smoothlyInput: EventEmitter<Record<string, string | string[] | undefined>>
	@Event() smoothlyChange: EventEmitter<Record<string, string | string[] | undefined>>
	@Event() smoothlyFormInput: EventEmitter<void>
	private dropDown?: HTMLDivElement
	private input?: HTMLInputElement

	componentWillLoad() {
		this.smoothlyFormInput.emit()
		this.smoothlyInput.emit({ [this.name]: this.value })
		this.optionFiltered = this.options
		if (this.multiple) {
			this.filterable = false

			window.addEventListener("click", (e: Event) => {
				if (!this.isHovered && this.focused && e.target !== this.input)
					this.focused = false
			})
		}

		if (this.value && Array.isArray(this.value))
			this.filter = this.options
				.filter(option => this.value?.includes(option.value))
				.map(option => option.label || option.value)
				.join(", ")
		else if (this.value) {
			const target = this.options.filter(option => option.value === this.value)[0]
			this.filter = target.label || target.value || ""
		}
	}

	@Watch("value")
	onChangeValue(value: File, pre: File | undefined) {
		if (value != pre)
			this.smoothlyChange.emit({ [this.name]: this.value })
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	onFocus() {
		this.focused = true
		this.smoothlyFocus.emit()
	}

	onBlur() {
		this.focused = false
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

		if (!this.filter)
			this.optionFiltered = this.options
		else
			this.optionFiltered = this.options.filter(option =>
				new RegExp(this.filter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(
					(option.label || option.value).toLocaleLowerCase()
				)
			)
	}

	onKeyDown(key: string) {
		this.focused = true
		if (key === "ArrowDown" && this.dropDown) {
			let i = 0
			if (this.current) {
				this.dropDown?.childNodes.forEach((option: HTMLDivElement, index) => {
					option.classList.remove("focused")
					if (option === this.current)
						i = index + 1
				})
			}
			this.current = (this.dropDown?.childNodes[i] || this.dropDown?.childNodes[i - 1]) as HTMLDivElement
			this.current.classList.add("focused")
			this.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
		}

		if (key === "ArrowUp" && this.dropDown) {
			if (this.current) {
				this.dropDown?.childNodes.forEach((option: HTMLDivElement, index) => {
					option.classList.remove("focused")
					if (option === this.current) {
						this.current = (this.dropDown?.childNodes[index - 1] as HTMLDivElement) || undefined
						this.current?.classList.add("focused")
					}
				})
			}
			this.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
		}

		if (key === "Enter" && this.current instanceof HTMLDivElement) {
			if (!this.multiple) {
				this.filter = this.current.textContent || ""
				this.value = this.current.dataset.value
				this.focused = false
			} else
				this.onSelectMutiple(this.current.dataset.value || "")
		}

		if (key === "Escape") {
			if (!this.multiple) {
				this.filter = ""
				this.value = undefined
			}
			this.current?.classList.remove("focused")
			this.onBlur()
			this.input?.blur()
		}
	}

	onClick(e: Event) {
		if (!this.multiple) {
			this.filter = (e.target as HTMLDivElement).textContent || ""
			this.value = (e.target as HTMLDivElement).dataset.value
			this.focused = false
		} else
			this.onSelectMutiple((e.target as HTMLDivElement).dataset.value || "")
	}

	onSelectMutiple(value: string) {
		let newValue
		if (this.value?.includes(value) && Array.isArray(this.value))
			newValue = this.value.filter(option => option !== value)
		else if (Array.isArray(this.value))
			newValue = [...this.value, value]
		else
			newValue = [value]

		if (Array.isArray(newValue) && newValue.length)
			this.value = newValue
		else
			this.value = undefined

		this.filter = this.options
			.filter(option => this.value?.includes(option.value))
			.map(option => option.label || option.value)
			.join(", ")
	}

	render() {
		return (
			<Host>
				<input
					readOnly={!this.filterable}
					ref={e => (this.input = e)}
					type="text"
					onKeyDown={e => {
						if (this.multiple) {
							e.stopPropagation()
							e.preventDefault()
						}
						this.onKeyDown(e.key)
					}}
					onInput={(e: KeyboardEvent) => this.onInput(e)}
					onFocus={() => this.onFocus()}
					onBlur={() => {
						if (!this.isHovered) {
							if (!this.value && this.filter)
								this.filter = ""
							this.onBlur()
						}
					}}
					value={this.filter}
					name={this.name}
					disabled={this.disabled}
					required={this.required}
				/>
				{this.focused && (
					<div
						class="dropdown"
						ref={e => (this.dropDown = e)}
						onMouseLeave={() => (this.isHovered = false)}
						onMouseEnter={() => (this.isHovered = true)}>
						{this.optionFiltered.map(option => (
							<div
								onClick={e => this.onClick(e)}
								class={option.value === this.value || this.value?.includes(option.value) ? "selected option" : "option"}
								data-value={option.value}>
								{option.label || option.value}
							</div>
						))}
					</div>
				)}
			</Host>
		)
	}
}
