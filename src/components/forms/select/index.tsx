import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch } from "@stencil/core"
import { Method } from "@stencil/core"
import { Icon } from "../../icon/Icon"
import { Colors, Input, Layout, Placement, Radius } from "../Input"

export type Options = { label?: string; value: string }

@Component({
	tag: "smoothly-select-new",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySelectNew implements Input {
	@Prop() name: string
	@Prop({ mutable: true }) value?: string | string[]
	@Prop() options: Options[]
	@Prop({ reflect: true, mutable: true }) filterable = false
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) required = false
	@Prop({ reflect: true }) multiple = false
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
	@Prop({ reflect: true, mutable: true }) focused = false

	@State() isHovered = false
	@State() filter: string
	@State() optionFiltered: Options[]
	@State() current: HTMLDivElement | undefined

	@Event() smoothlyInput: EventEmitter<Record<string, string | string[] | undefined>>
	@Event() smoothlyChange: EventEmitter<Record<string, string | string[] | undefined>>
	@Event() smoothlyInputLoad: EventEmitter<void>
	@Element() element: HTMLSmoothlySelectNewElement

	private dropDown?: HTMLDivElement
	private input: HTMLSmoothlyInputBaseElement

	componentWillLoad() {
		this.smoothlyInputLoad.emit()
		this.smoothlyInput.emit({ [this.name]: this.value })
		this.optionFiltered = this.options
		if (this.multiple) {
			this.filterable = false

			window.addEventListener("click", (e: Event) => {
				if (!this.isHovered && this.focused && e.target !== this.input)
					this.onBlur()
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

	componentWillUpdate() {
		if (this.value) {
			if (!this.multiple) {
				const filter = this.options.filter(option => option.value === this.value)[0]
				if (filter && this.filter !== filter.value)
					this.filter = filter.label || filter.value
			} else {
				const filter = this.options
					.filter(option => this.value?.includes(option.value))
					.map(option => option.label || option.value)
					.join(", ")
				if (filter && this.filter !== filter)
					this.filter = filter
			}
		}
	}

	@Watch("value")
	onChangeValue(value: File, pre: File | undefined) {
		if (value != pre)
			this.smoothlyChange.emit({ [this.name]: this.value })
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	onFocus() {
		if (!this.readonly)
			this.focused = true
	}

	onBlur() {
		this.focused = false
	}

	onInput(e: CustomEvent) {
		const match = this.options.filter(option => (option.label || option.value) === e.detail.value)[0]
		if (match)
			this.value = match.value
		else
			this.value = undefined
		this.filter = e.detail.value

		if (!this.filter)
			this.optionFiltered = this.options
		else
			this.optionFiltered = this.options.filter(option =>
				new RegExp(this.filter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(
					(option.label || option.value).toLocaleLowerCase()
				)
			)
	}

	onKeyDown(e: KeyboardEvent) {
		this.focused = true
		if (e.key === "ArrowDown" && this.dropDown) {
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
			e.stopPropagation()
			e.preventDefault()
			this.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
		}

		if (e.key === "ArrowUp" && this.dropDown) {
			if (this.current) {
				this.dropDown?.childNodes.forEach((option: HTMLDivElement, index) => {
					option.classList.remove("focused")
					if (option === this.current) {
						this.current = (this.dropDown?.childNodes[index - 1] as HTMLDivElement) || undefined
						this.current?.classList.add("focused")
					}
				})
			}
			e.stopPropagation()
			e.preventDefault()
			this.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
		}

		if (e.key === "Enter" && this.current instanceof HTMLDivElement) {
			if (!this.multiple) {
				this.filter = this.current.textContent || ""
				this.value = this.current.dataset.value
				this.focused = false
				this.input?.blur()
			} else
				this.onSelectMutiple(this.current.dataset.value || "")
		}

		if (e.key === "Escape") {
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
			this.input?.blur()
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

	@Method()
	async clear(): Promise<void> {
		this.value = undefined
		this.filter = ""
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
		console.log(Boolean(this.value))
		return (
			<Host>
				<div class="input-container" onClick={() => this.input.click()}>
					<label htmlFor={this.name}>
						<slot />
					</label>
					<smoothly-input-base
						focused={Boolean(this.value)}
						onFocus={() => this.onFocus()}
						onBlur={() => {
							if (!this.isHovered) {
								if (!this.value && this.filter)
									this.filter = ""
								this.onBlur()
							}
						}}
						onKeyDown={e => this.onKeyDown(e)}
						onInput={(e: CustomEvent) => this.onInput(e)}
						name={this.name}
						placeholder={Input.placeholder(this.placement, this.value, this.focused) ? this.placeholder : undefined}
						required={this.required}
						disabled={this.disabled}
						readonly={!this.filterable || this.readonly}
						value={this.filter}
						ref={(el: HTMLSmoothlyInputBaseElement) => (this.input = el)}
					/>
					<smoothly-icon
						color={this.fill}
						onClick={() => Input.onClickIcon(this.value, this.editable, this.clearable, this.readonly, this.element)}
						size="tiny"
						name={Input.icon(this.value, this.editable, this.clearable, this.readonly, this.icon)}
					/>
				</div>
				{this.info && <div class="input-info">{this.info}</div>}
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
