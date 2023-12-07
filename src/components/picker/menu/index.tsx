import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from "@stencil/core"
import global from "../../../global/index"
import { Notice, Option } from "../../../model"
import { Looks } from "../../input/Looks"
import { Slot } from "../slot-elements"

const Observers = global().Observers

function* chain<T>(...iterables: Iterable<T>[]): Iterable<T> {
	for (const iterable of iterables)
		yield* iterable
}

function restore<T extends Option>(target: T | undefined, source: Option): T | undefined {
	target?.set.selected((target.selected = source.selected))
	target?.set.readonly((target.readonly = source.readonly))
	target?.set.visible((target.visible = source.visible))
	target?.set.value((target.value = source.value))
	target?.set.search((target.search = source.search))
	return target
}
function restoreListener(ref: HTMLElement | undefined, option: Option) {
	ref?.addEventListener("smoothlyPickerOptionLoad", (e: CustomEvent<Option>) => restore(e.detail, option))
}
export interface Controls {
	remember: () => void
	restore: () => void
}
@Component({
	tag: "smoothly-picker-menu",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerMenu {
	@Element() element: HTMLSmoothlyPickerMenuElement
	@Prop() looks: Looks
	@Prop({ reflect: true }) open = false
	@Prop({ reflect: true }) multiple = false
	@Prop({ reflect: true }) mutable = false
	@Prop({ reflect: true }) readonly = false
	@Prop() validator?: (value: string) => boolean | { result: boolean; notice: Notice }
	@State() backend = new Map<any, Option & { clone: Node }>() // value -> Option
	@State() options = new Map<any, Option>() // value -> Option
	@State() created = new Map<any, Option.Created>()
	@State() search = ""
	@State() valid = false
	@State() display: Node[]
	@State() flip = false
	@State() flipChecked = false
	@Event() notice: EventEmitter<Notice>
	@Event() smoothlyPickerMenuLoaded: EventEmitter<Controls & { synced: () => boolean }>
	private memory?: { backend: SmoothlyPickerMenu["backend"]; options: SmoothlyPickerMenu["options"] }
	private listElement?: HTMLElement
	private searchElement?: HTMLElement
	// private loading = true
	private synced = false

	componentWillLoad() {
		if (!Observers.has(this.element)) {
			const threshold = 0.4
			Observers.set(
				this.element,
				new IntersectionObserver(
					entries =>
						(entries.find(entry => entry.target == this.element)?.intersectionRatio ?? 0) < threshold &&
						!this.flipChecked &&
						((this.flip = !this.flip), (this.flipChecked = true)),
					{ threshold }
				)
			)
		}
	}
	sync() {
		if (this.backend.size != this.options.size)
			this.synced = false
		else
			this.synced = true
	}
	componentDidLoad() {
		this.smoothlyPickerMenuLoaded.emit({
			remember: () => {
				this.memory = {
					backend: new Map(Array.from(this.backend.entries(), ([value, option]) => [value, { ...option }])),
					options: new Map(Array.from(this.options.entries(), ([value, option]) => [value, { ...option }])),
				}
			},
			restore: () => {
				if (this.memory) {
					for (const option of this.options.values()) {
						const memory = this.memory.options.get(option.value)
						if (memory != undefined)
							restore(option, memory)
						else if (this.created.get(option.value))
							option.set.selected((option.selected = false))
					}
					for (const option of this.backend.values()) {
						const memory = this.memory.backend.get(option.value)
						if (memory != undefined)
							restore(option, memory)
						else if (this.created.get(option.value))
							option.set.selected((option.selected = false))
					}
				}
			},
			synced: () => this.synced,
		})
	}
	disconnectedCallback() {
		if (!this.element.parentElement) {
			Observers.get(this.element)?.disconnect()
			Observers.remove(this.element)
		}
	}
	@Watch("open")
	openChange() {
		const observer = Observers.get(this.element)
		if (this.open)
			observer?.observe(this.element)
		else
			observer?.unobserve(this.element)
	}

	@Watch("readonly")
	readonlyChanged() {
		for (const option of chain(this.options.values(), this.backend.values()))
			option.element, option.set.readonly(this.readonly)
	}
	@Listen("scroll", { target: "window" })
	scrollHandler() {
		this.flipChecked = false
	}
	@Listen("smoothlyPickerOptionLoad")
	optionLoadHandler(event: CustomEvent<Option.Load>) {
		if (!this.listElement || !event.composedPath().includes(this.listElement)) {
			event.stopPropagation()
			this.sync()
			event.detail.set.readonly(this.readonly)

			const current = this.options.get(event.detail.value)
			if (current)
				event.detail.set.selected(current.element.selected)
		}
	}
	@Listen("smoothlyPickerOptionLoaded")
	optionLoadedHandler(event: CustomEvent<Option>) {
		if (!this.listElement || !event.composedPath().includes(this.listElement)) {
			event.stopPropagation()
			const current = restore(this.backend.get(event.detail.value), event.detail)
			this.backend = new Map(
				this.backend
					.set(event.detail.value, {
						...event.detail,
						clone: current?.clone ?? event.detail.element.cloneNode(true),
					})
					.entries()
			)
		} else
			this.options.set(event.detail.value, event.detail)
		this.sync()
	}
	@Listen("smoothlyPickerOptionChange")
	optionChangeHandler(event: CustomEvent<Option>) {
		if (!this.listElement || !event.composedPath().includes(this.listElement)) {
			event.stopPropagation()
			this.options.get(event.detail.value)?.set.selected(event.detail.selected)
		} else {
			const current = this.backend.get(event.detail.value)
			if (current?.element.parentElement)
				current?.set.selected(event.detail.selected)
		}

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
		if (this.mutable) {
			if (typeof validation == "object" ? validation.result : validation) {
				if (!this.multiple)
					for (const option of chain(this.options.values(), this.backend.values()))
						option.set.selected(false)
				this.created = new Map(this.created.set(this.search, { value: this.search, selected: true }).entries())
				this.search = ""
				this.searchElement?.focus()
				this.valid = false
			}
			if (typeof validation == "object")
				this.notice.emit(validation.notice)
		}
	}
	keyDownHandler(event: KeyboardEvent) {
		if (event.key == "Enter") {
			event.preventDefault()
			this.addHandler()
		}
	}
	@Listen("smoothlySlotEmpty")
	emptyDisplayHandler(event: CustomEvent<Slot>) {
		event.stopPropagation()
		event.detail.set.nodes(this.display)
	}
	render() {
		return (
			<Host class={{ valid: this.valid, flip: this.flip }}>
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
						ref={e => (this.searchElement = e)}
						name="search"
						value={this.search}
						looks={this.looks}
						onKeyDown={e => this.keyDownHandler(e)}
						onSmoothlyInput={e => this.inputHandler(e)}
						onSmoothlyChange={e => e.stopPropagation()}
						onSmoothlyBlur={e => e.stopPropagation()}>
						<slot name="search" />
					</smoothly-input>
					{this.mutable && !this.readonly ? (
						<button onClick={() => this.addHandler()} disabled={!this.valid} type={"button"}>
							<smoothly-icon name="add-outline" />
						</button>
					) : null}
				</div>
				<div class={"list"} ref={e => (this.listElement = e)}>
					{Array.from(this.backend.values())
						.sort((a, b) => a.position - b.position)
						.map(option => (
							<smoothly-slot-elements ref={e => restoreListener(e, option)} clone={false} nodes={option.clone} />
						))}
				</div>
			</Host>
		)
	}
}
