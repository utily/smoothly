import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State } from "@stencil/core"
import { Option } from "../../../model"
import { Notice } from "../../../model"
@Component({
	tag: "smoothly-picker-menu",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerMenu {
	@Element() element: HTMLElement
	@Prop({ reflect: true }) multiple = false
	@Prop({ reflect: true }) mutable = false
	@Prop() label = "Search"
	@Prop() validator?: (value: string) => boolean | { result: boolean; notice: Notice }
	@Prop() labeledDefault = false
	@State() allowed = false
	@State() new: Option.New[] = []
	@State() search = ""
	@Event() notice: EventEmitter<Notice>
	private options = new Map<any, Option>()
	private searchElement?: HTMLElement

	@Listen("smoothlyPickerOptionLoaded")
	optionLoadedHandler(event: CustomEvent<Option>) {
		this.options.set(event.detail.element.name, event.detail)
	}
	@Listen("smoothlyPickerOptionChanged")
	optionChangedHandler(event: CustomEvent<Option>) {
		if (!this.multiple && event.detail.element.selected) {
			for (const option of this.options.values())
				if (option.element != event.detail.element)
					option.element.selected = false
		}
	}
	inputHandler(event: CustomEvent<Record<string, any>>) {
		event.stopImmediatePropagation()
		this.search = event.detail.search
		if (!this.search) {
			this.allowed = false
			for (const option of this.options.values())
				option.element.visible = true
		} else {
			this.allowed = !Array.from(this.options.values()).find(option => option.value == this.search)
			for (const option of this.options.values())
				option.element.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())
					? (option.element.visible = true)
					: (option.element.visible = false)
		}
	}
	keyDownHandler(event: KeyboardEvent) {
		if (event.key == "Enter") {
			event.preventDefault()
			this.addHandler()
		}
	}
	addHandler() {
		const validation = !this.validator ? true : this.validator(this.search)
		if (typeof validation == "object" ? validation.result : validation) {
			if (!this.multiple)
				for (const option of this.options.values())
					option.element.selected = false
			this.new = [...this.new, { value: this.search, selected: true }]
			this.search = ""
			this.searchElement?.focus()
		}
		if (typeof validation == "object")
			this.notice.emit(validation.notice)
	}
	render() {
		return (
			<Host>
				<div class={"controls"}>
					<smoothly-input
						ref={element => (this.searchElement = element)}
						name={"search"}
						value={this.search}
						onSmoothlyInput={e => this.inputHandler(e)}
						onSmoothlyChange={e => this.inputHandler(e)}
						onKeyDown={event => this.keyDownHandler(event)}>
						{this.label}
					</smoothly-input>
					{this.mutable ? (
						<button onClick={() => this.addHandler()} disabled={!this.allowed} class={"add"} type={"button"}>
							<smoothly-icon name="add-outline" />
						</button>
					) : null}
				</div>
				<div class={"items"}>
					<slot />
					{this.new.map(option => (
						<smoothly-picker-option
							labeled={this.labeledDefault}
							selected={option.selected}
							value={option.value}
							onSmoothlyPickerOptionChanged={event => (option.selected = event.detail.element.selected)}>
							{option.value}
						</smoothly-picker-option>
					))}
				</div>
			</Host>
		)
	}
}
