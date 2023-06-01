import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from "@stencil/core"
import { Notice } from "../../../../model"
import { Option2 } from "../option"
import { Slot } from "../slot-elements"

function* chain<T>(...iterables: Iterable<T>[]): Iterable<T> {
	for (const iterable of iterables)
		yield* iterable
}

function restore(clone: Option2 | undefined, option: Option2): Option2 | undefined {
	clone?.set.selected((clone.selected = option.selected))
	clone?.set.readonly((clone.readonly = option.readonly))
	clone?.set.visible((clone.visible = option.visible))
	clone?.set.value((clone.value = option.value))
	return clone
}

function restoreListener(ref: HTMLElement | undefined, option: Option2) {
	ref?.addEventListener("smoothlyPickerOptionLoad", (e: CustomEvent<Option2>) => restore(e.detail, option))
}

@Component({
	tag: "smoothly-picker-menu2",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerMenu2 {
	@Element() element: HTMLSmoothlyPickerMenu2Element
	@Prop() multiple = false
	@Prop() mutable = false
	@Prop() readonly = false
	@Prop() validator?: (value: string) => boolean | { result: boolean; notice: Notice }
	@State() backend = new Map<any, Option2 & { clone: Node }>() // value -> Option2
	@State() options = new Map<any, Option2>() // value -> Option2
	@State() created = new Map<any, Option2.Created>()
	@State() search = ""
	@State() valid = false
	@State() display: Node[]
	@Event() notice: EventEmitter<Notice>
	private listElement?: HTMLElement

	@Watch("display")
	displayChanged() {
		console.log("display changed", this.display)
	}

	@Watch("readonly")
	readonlyChanged() {
		for (const option of chain(this.options.values(), this.backend.values()))
			if (this.readonly)
				option.set.readonly(this.readonly)
	}

	@Listen("smoothlyPickerOptionLoad")
	optionLoadHandler(event: CustomEvent<Option2.Load>) {
		// internal event!
		if (!this.listElement || !event.composedPath().includes(this.listElement)) {
			event.stopPropagation()
			console.log("internal load", event.detail.value)
			event.detail.set.readonly(this.readonly)
		} else
			console.log("external load", event.detail.value)
	}
	@Listen("smoothlyPickerOptionLoaded")
	optionLoadedHandler(event: CustomEvent<Option2>) {
		// internal event
		if (!this.listElement || !event.composedPath().includes(this.listElement)) {
			event.stopPropagation()
			const current = restore(this.options.get(event.detail.value), event.detail)
			const currentBackend = this.backend.get(event.detail.value)
			console.log(currentBackend)
			this.backend = new Map(
				this.backend
					.set(event.detail.value, {
						...event.detail,
						clone: current?.element ?? event.detail.element.cloneNode(true),
					})
					.entries()
			)
			console.log(this.backend.get(event.detail.value)?.clone == current?.element ?? undefined)
		} // external event
		else
			this.options.set(event.detail.value, event.detail)
	}
	@Listen("smoothlyPickerOptionChange")
	optionChangeHandler(event: CustomEvent<Option2>) {
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
			for (const option of chain(this.options.values(), this.backend.values()))
				option.set.visible(option.value.toString().toLocaleLowerCase().includes(this.search.toLocaleLowerCase()))
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
		console.log("slot empty display")
		event.detail.set.nodes(this.display)
	}
	render() {
		return (
			<Host>
				<smoothly-slotted-elements
					onSmoothlySlottedChange={e => (console.log("menu display", this.display), (this.display = e.detail))}>
					<slot name="display" />
				</smoothly-slotted-elements>
				<div class={"backends"}>
					<slot />
					{Array.from(this.created.values(), option => (
						<smoothly-picker-option2 key={option.value} value={option.value} selected={option.selected}>
							{option.value}
							<smoothly-slot-elements slot="display" nodes={this.display} />
						</smoothly-picker-option2>
					))}
				</div>
				<div>
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
					) : null}
				</div>
				<div ref={e => (this.listElement = e)}>
					{Array.from(this.backend.values()).map(option => (
						<smoothly-slot-elements ref={e => restoreListener(e, option)} clone={false} nodes={option.clone} />
					))}
				</div>
			</Host>
		)
	}
}
