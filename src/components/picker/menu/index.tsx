import { Component, Element, Event, EventEmitter, Fragment, h, Host, Listen, Prop, State, Watch } from "@stencil/core"
import { Notice } from "../../../model"
import { Option } from "../option"
import { Slot } from "../slot-elements"

function* chain<T>(...iterables: Iterable<T>[]): Iterable<T> {
	for (const iterable of iterables)
		yield* iterable
}

function restore(clone: Option | undefined, option: Option): Option | undefined {
	clone?.set.selected((clone.selected = option.selected))
	clone?.set.readonly((clone.readonly = option.readonly))
	clone?.set.visible((clone.visible = option.visible))
	clone?.set.value((clone.value = option.value))
	clone?.set.search((clone.search = option.search))
	return clone
}

function restoreListener(ref: HTMLElement | undefined, option: Option) {
	ref?.addEventListener("smoothlyPickerOptionLoad", (e: CustomEvent<Option>) => restore(e.detail, option))
}

@Component({
	tag: "smoothly-picker-menu",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerMenu {
	@Element() element: HTMLSmoothlyPickerMenuElement
	@Prop() multiple = false
	@Prop() mutable = false
	@Prop() readonly = false
	@Prop() validator?: (value: string) => boolean | { result: boolean; notice: Notice }
	@State() backend = new Map<any, Option & { clone: Node }>() // value -> Option
	@State() options = new Map<any, Option>() // value -> Option
	@State() created = new Map<any, Option.Created>()
	@State() search = ""
	@State() valid = false
	@State() display: Node[]
	@Event() notice: EventEmitter<Notice>
	private listElement?: HTMLElement

	@Watch("readonly")
	readonlyChanged() {
		for (const option of chain(this.options.values(), this.backend.values()))
			if (this.readonly)
				option.set.readonly(this.readonly)
	}

	@Listen("smoothlyPickerOptionLoad")
	optionLoadHandler(event: CustomEvent<Option.Load>) {
		// internal event!
		if (!this.listElement || !event.composedPath().includes(this.listElement)) {
			event.stopPropagation()
			event.detail.set.readonly(this.readonly)
		}
	}
	@Listen("smoothlyPickerOptionLoaded")
	optionLoadedHandler(event: CustomEvent<Option>) {
		// internal event
		if (!this.listElement || !event.composedPath().includes(this.listElement)) {
			event.stopPropagation()
			const current = restore(this.options.get(event.detail.value), event.detail)
			this.backend = new Map(
				this.backend
					.set(event.detail.value, {
						...event.detail,
						clone: current?.element ?? event.detail.element.cloneNode(true),
					})
					.entries()
			)
		} // external event
		else
			this.options.set(event.detail.value, event.detail)
	}
	@Listen("smoothlyPickerOptionChange")
	optionChangeHandler(event: CustomEvent<Option>) {
		// internal event
		if (!this.listElement || !event.composedPath().includes(this.listElement)) {
			event.stopPropagation()
			this.options.get(event.detail.value)?.set.selected(event.detail.selected)
		} // external event
		else
			this.backend.get(event.detail.value)?.set.selected(event.detail.selected)
		if (!this.readonly && !this.multiple && event.detail.selected)
			for (const option of chain(this.options.values(), this.backend.values()))
				if (option.value != event.detail.value)
					option.set.selected(false)
	}
	inputHandler(event: CustomEvent<Record<string, any>>) {
		event.stopPropagation()
		this.search = event.detail.search
		if (!this.search) {
			this.valid = false
			for (const option of chain(this.options.values(), this.backend.values()))
				option.set.visible(true)
		} else {
			this.valid = !Array.from(this.options.values()).find(option => option.value == this.search)
			const search = this.search.toLocaleLowerCase()
			for (const option of chain(this.options.values(), this.backend.values())) {
				const value = option.value.toString().toLocaleLowerCase().includes(search)
				const searches = option.search.some(value => value.includes(search))
				const result = value || searches
				option.set.visible(result)
			}
		}
	}
	addHandler() {
		const validation = !this.validator ? true : this.validator(this.search)
		if (typeof validation == "object" ? validation.result : validation) {
			if (!this.multiple)
				for (const option of chain(this.options.values(), this.backend.values()))
					option.set.selected(false)
			this.created = new Map(this.created.set(this.search, { value: this.search, selected: true }).entries())
			this.search = ""
		}
		if (typeof validation == "object")
			this.notice.emit(validation.notice)
	}
	keyDownHandler(event: KeyboardEvent) {
		if (event.key == "Enter")
			event.preventDefault(), this.addHandler()
	}
	@Listen("smoothlySlotEmpty")
	emptyDisplayHandler(event: CustomEvent<Slot>) {
		event.stopPropagation()
		event.detail.set.nodes(this.display)
	}
	render() {
		return (
			<Host class={{ valid: this.valid }}>
				<smoothly-slotted-elements class={"hide"} onSmoothlySlottedChange={e => (this.display = e.detail)}>
					<slot name="display" />
				</smoothly-slotted-elements>
				<div class={"hide"}>
					<slot />
					{Array.from(this.created.values(), option => (
						<smoothly-picker-option key={option.value} value={option.value} selected={option.selected}>
							{option.value}
							<smoothly-slot-elements slot="display" nodes={this.display} />
						</smoothly-picker-option>
					))}
				</div>
				<div class={"controls"}>
					<smoothly-input
						name="search"
						value={this.search}
						onSmoothlyInput={e => this.inputHandler(e)}
						onSmoothlyChange={e => e.stopPropagation()}
						onSmoothlyBlur={e => e.stopPropagation()}>
						<slot name="search" />
					</smoothly-input>
					{this.mutable ? (
						<button onClick={() => this.addHandler()} disabled={!this.valid} type={"button"}>
							<smoothly-icon name="add-outline" />
						</button>
					) : (
						<Fragment></Fragment>
					)}
				</div>
				<div class={"list"} ref={e => (this.listElement = e)}>
					{Array.from(this.backend.values()).map(option => (
						<smoothly-slot-elements ref={e => restoreListener(e, option)} clone={false} nodes={option.clone} />
					))}
				</div>
			</Host>
		)
	}
}
