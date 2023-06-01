import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State } from "@stencil/core"
import { Option } from "../../../../model"
import { Notice } from "../../../../model"
@Component({
	tag: "smoothly-picker-menu-old",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerMenuOld {
	@Element() element: HTMLElement
	@Prop({ reflect: true }) multiple = false
	@Prop({ reflect: true }) mutable = false
	@Prop({ reflect: true }) readonly = false
	@Prop() validator?: (value: string) => boolean | { result: boolean; notice: Notice }
	@Prop() labeledDefault = false
	@State() allowed = false
	@State() history = new Map<any, Option>()
	@State() created: Option.New[] = []
	@State() search = ""
	@Event() notice: EventEmitter<Notice>
	private options = new Map<any, Option>()
	private searchElement?: HTMLElement
	// private itemsElement?: HTMLElement

	// @Watch("readonly")
	// readonlyChanged() {
	// 	for (const option of this.options.values())
	// 		option.element.readonly = this.readonly
	// }

	// @Listen("smoothlyPickerOptionLoad")
	// optionLoadHandler(event: CustomEvent<HTMLSmoothlyPickerOptionElement>) {
	// 	if (this.readonly)
	// 		event.detail.readonly = true
	// }

	@Listen("smoothlyPickerOptionLoaded")
	optionLoadedHandler(event: CustomEvent<Option>) {
		const current = this.options.get(event.detail.element.value)
		const created = this.created.filter(option => option.value != current?.value)
		if (this.created.length != created.length)
			this.created = created
		this.options.set(event.detail.element.value, event.detail)
	}
	@Listen("smoothlyPickerOptionChanged")
	optionChangedHandler(event: CustomEvent<Option>) {
		if (!this.readonly && !this.multiple && event.detail.element.selected)
			for (const option of this.options.values())
				if (option.element != event.detail.element)
					option.element.selected = false
		const current = this.history.get(event.detail.element.value)
		if (current?.element.selected != event.detail.element.selected)
			if (event.detail.element.selected && this.history.delete(event.detail.element.value))
				this.history = new Map(this.history.entries())
			else
				this.history = new Map(this.history.set(event.detail.element.value, event.detail).entries())
	}

	inputHandler(event: CustomEvent<Record<string, any>>) {
		event.stopPropagation()
		this.search = event.detail.search
		if (!this.search) {
			this.allowed = false
			for (const option of this.options.values())
				option.element.visible = true
		} else {
			this.allowed = !Array.from(this.options.values()).find(option => option.value == this.search)
			// for (const option of this.options.values())
			// 	option.element.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())
			// 		? (option.element.visible = true)
			// 		: (option.element.visible = false)
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
			this.created = [...this.created, { value: this.search, selected: true }]
			this.search = ""
			this.searchElement?.focus()
		}
		if (typeof validation == "object")
			this.notice.emit(validation.notice)
	}
	componentDidRender() {
		// Array.from<Element & { name?: string }>(this.itemsElement?.children ?? [])
		// 	.sort((a, b) => ((a.name ?? "") < (b.name ?? "") ? 0 : 1))
		// 	.forEach(child => this.itemsElement?.appendChild(child))
	}
	render() {
		return (
			<Host>
				<div class={"controls"}>
					<smoothly-input
						ref={element => (this.searchElement = element)}
						name="search"
						value={this.search}
						onSmoothlyInput={e => this.inputHandler(e)}
						onSmoothlyChange={e => this.inputHandler(e)}
						onSmoothlyBlur={e => e.stopPropagation()}
						onKeyDown={event => this.keyDownHandler(event)}>
						<slot name="search" />
					</smoothly-input>
					{this.mutable ? (
						<button onClick={() => this.addHandler()} disabled={!this.allowed} class={"add"} type={"button"}>
							<smoothly-icon name="add-outline" />
						</button>
					) : null}
				</div>
				<div /*ref={e => (this.itemsElement = e)}*/ class={"items"}>
					<slot />
					{[
						...this.created.map(o => ({ ...o, element: { name: undefined } })),
						// ...Array.from(this.history.values(), o => ({ ...o, selected: false })),
					]
						// .sort((a, b) => ((a.element.name ?? "") < (b.element.name ?? "") ? 0 : 1))
						.map(option => (
							<smoothly-picker-option
								key={option.value}
								// labeled={this.labeledDefault}
								selected={option.selected}
								value={option.value}
								// onSmoothlyPickerOptionChanged={event => (option.selected = event.detail.element.selected)}
							>
								{option.value}
							</smoothly-picker-option>
						))}
				</div>
			</Host>
		)
	}
}
