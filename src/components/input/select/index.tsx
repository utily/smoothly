import {
	Component,
	ComponentWillLoad,
	Element,
	Event,
	EventEmitter,
	h,
	Host,
	Listen,
	Method,
	Prop,
	State,
	VNode,
	Watch,
} from "@stencil/core"
import { Color, Data } from "../../../model"
import { Item } from "../../item/Item"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"
import { Input } from "../Input"
import { Looks } from "../Looks"
import { layout } from "./layout"
import { menu } from "./menu"
import { scroll } from "./scroll"

@Component({
	tag: "smoothly-input-select",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputSelect implements Input, Editable, Clearable, ComponentWillLoad {
	parent: Editable | undefined
	isDifferentFromInitial = false
	private initialValue: HTMLSmoothlyItemElement[] = []
	private initialValueHandled = false
	private observer = Editable.Observer.create(this)
	private displayElement?: HTMLElement
	private iconsElement?: HTMLElement
	private toggleElement?: HTMLElement
	private dropdownElement?: HTMLElement
	private searchElement?: HTMLInputElement
	private items: HTMLSmoothlyItemElement[] = []
	private itemHeight: number | undefined
	@Element() element: HTMLSmoothlyInputSelectElement
	@Prop({ reflect: true }) invalid?: boolean = false
	@Prop({ reflect: true }) errorMessage?: string
	@Prop({ reflect: true }) name = "selected"
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true }) showLabel = true
	@Prop({ reflect: true, mutable: true }) showSelected?: boolean = true
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) inCalendar = false
	@Prop({ reflect: true }) ordered?: boolean
	@Prop({ reflect: true }) multiple = false
	@Prop() clearable = true
	@Prop({ mutable: true }) defined = false
	@Prop({ reflect: true }) placeholder?: string | any
	@Prop() menuHeight?: layout.MenuHeight
	@Prop() required = false
	@Prop() searchDisabled = false
	@Prop() mutable = false
	private lastOpen = false
	@State() open = false
	@State() selected: HTMLSmoothlyItemElement[] = []
	@State() filter = ""
	@State() addedItems: HTMLSmoothlyItemElement[] = []
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyUserInput: EventEmitter<Input.UserInput>
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	@Event() smoothlyItemSelect: EventEmitter<HTMLSmoothlyItemElement>
	@Event() smoothlySelectOpen: EventEmitter<boolean>

	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit(
			(looks, color) => ((this.looks = this.looks ?? looks), !this.color && (this.color = color))
		)
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.observer.publish()
	}
	componentDidLoad(): void | Promise<void> {
		this.selected && !this.initialValueHandled && (this.initialValue = [...this.selected])
		this.initialValueHandled = true
		this.onSelectedChange()
	}
	componentDidRender(): void | Promise<void> {
		this.itemHeight ??= layout.firstItemHeight(this.items)
		if (this.menuHeight && this.itemHeight) {
			layout.applyMenuHeight(this.element, this.itemHeight, this.menuHeight)
		}
		layout.applyElementHeight(this.element)

		const justOpened = this.open && !this.lastOpen
		if (justOpened && this.ordered) {
			this.scrollToSelected()
		}
	}
	private scrollToSelected() {
		const selectedItem = menu.findFirstSelected(this.items)
		if (selectedItem) {
			menu.markOnly(this.items, selectedItem)
			scroll.centerInView(this.dropdownElement, selectedItem, "instant")
		}
	}
	async disconnectedCallback() {
		if (!this.element.isConnected) {
			await this.unregister()
		}
	}
	@Watch("name")
	nameChange(_: string | undefined, oldName: string | undefined) {
		Input.formRename(this, oldName)
	}
	@Method()
	async register() {
		Input.formAdd(this)
	}
	@Method()
	async unregister() {
		Input.formRemove(this)
	}
	@Method()
	async getValue(): Promise<any | any[] | undefined> {
		return !this.multiple && this.selected[0]
			? this.selected[0].value
			: this.multiple && this.selected.length > 0
				? this.selected.map(item => item.value)
				: undefined
	}
	@Method()
	async getItems(): Promise<HTMLSmoothlyItemElement[]> {
		return this.items
	}
	@Method()
	async listen(listener: Editable.Observer.Listener): Promise<void> {
		this.observer.subscribe(listener)
	}
	@Method()
	async reset(): Promise<void> {
		this.selected.forEach(item => (item.selected = item.hidden = false))
		this.initialValue.forEach(item => (item.selected = true))
		this.selected = [...this.initialValue]
		this.displaySelected()
		this.isDifferentFromInitial = false
		this.open = false
	}

	@Method()
	async clear(): Promise<void> {
		if (this.clearable) {
			this.selected.forEach(item => (item.selected = item.hidden = false))
			this.selected = []
			if (this.displayElement) {
				this.displayElement.innerHTML = this.placeholder ?? ""
			}
		}
	}
	@Method()
	async edit(editable: boolean): Promise<void> {
		this.readonly = !editable
	}
	@Method()
	async setInitialValue(): Promise<void> {
		this.isDifferentFromInitial = false
		this.initialValue = [...this.selected]
	}
	@Watch("selected")
	async onSelectedChange() {
		this.initialValueHandled && (this.isDifferentFromInitial = !this.areValuesEqual(this.selected, this.initialValue))
		this.defined = this.selected.length > 0
		this.smoothlyInput.emit({ [this.name]: await this.getValue() })
		this.observer.publish()
	}
	@Watch("required")
	onRequiredChange(): void {
		this.items.forEach(item => (item.deselectable = !this.required))
	}
	@Watch("filter")
	async onFilterChange(value: string): Promise<void> {
		value = value.toLowerCase()
		await Promise.all(this.items.map(item => item.filter(value)))
	}
	@Watch("disabled")
	@Watch("readonly")
	watchingReadonly(): void {
		this.observer.publish()
	}
	@Listen("smoothlyInputLoad")
	async smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputSelect) => void>): Promise<void> {
		if (
			event.target &&
			(("name" in event.target && event.target.name !== this.name) ||
				(event.composedPath().some(e => e == this.iconsElement) &&
					!event.composedPath().some(e => e == this.toggleElement)))
		) {
			event.stopPropagation()
		} else if (Item.Element.is(event.target)) {
			event.stopPropagation()
			event.target.deselectable = !this.required
			this.items.push(event.target as HTMLSmoothlyItemElement)
		}
		Input.registerSubAction(this, event)
		this.displaySelected()
	}
	@Listen("click", { target: "window" })
	onWindowClick(event: MouseEvent): void {
		if (this.open && !event.composedPath().includes(this.element)) {
			this.open = false
			this.resetFilter()
		}
	}
	@Listen("smoothlyItemDOMChange")
	onItemDomChange(e: CustomEvent) {
		e.stopPropagation()
		const item = e.target as HTMLSmoothlyItemElement
		if (item.selected) {
			this.displaySelected()
		}
	}
	@Listen("smoothlyItemSelect")
	async onItemSelect(event: CustomEvent<{ userInitiated: boolean; item: HTMLSmoothlyItemElement }>): Promise<void> {
		event.stopPropagation()
		const item = event.detail.item
		if (this.multiple) {
			this.selected = item.selected ? [...this.selected, item] : this.selected.filter(item => item.selected)
		} else if (item.selected || !this.items.some(e => e.selected)) {
			this.selected[0] && (this.selected[0].hidden = this.selected[0].selected = false)
			this.selected = !item.selected ? this.selected.filter(item => item.selected) : [item]
			!this.showSelected && item.selected && (item.hidden = true)
		}
		this.displaySelected()
		if (event.detail.userInitiated) {
			this.smoothlyUserInput.emit({ name: this.name, value: await this.getValue() })
		}
	}
	@Watch("open")
	onClosed(open: boolean, before: boolean): void {
		this.lastOpen = before
		if (!open) {
			const markedItem = menu.findFirstMarked(this.items)
			if (markedItem) {
				markedItem.marked = false
			}
		}
		this.smoothlySelectOpen.emit(open)
	}
	areValuesEqual(selected: HTMLSmoothlyItemElement[], initialValue: HTMLSmoothlyItemElement[]): boolean {
		return selected.length === initialValue.length && initialValue.every(value => selected.includes(value))
	}
	displaySelected(): void {
		const displayString: string = this.selected.map(option => `<div>${option.innerHTML}</div>`).join("")
		this.displayElement &&
			(this.displayElement.innerHTML = this.selected.length > 0 ? displayString : (this.placeholder ?? ""))
	}
	onKeyDown(event: KeyboardEvent) {
		event.stopPropagation()
		const key = event.key
		if (key == "ArrowUp" || key == "ArrowDown") {
			event.preventDefault()
			this.handlerNavigate(key)
		} else if (key == "Escape") {
			event.preventDefault()
			this.handleEscape()
		} else if (key == "Enter") {
			event.preventDefault()
			this.handleEnter()
		} else if (key == " ") {
			event.preventDefault()
			this.openMenu()
		} else if (this.open && key == "Tab") {
			this.closeMenu()
		}
	}
	private handlerNavigate(key: "ArrowUp" | "ArrowDown") {
		if (menu.hasVisibleItems(this.items)) {
			this.move(key == "ArrowUp" ? -1 : 1)
		}
		this.openMenu()
	}
	private handleEscape() {
		if (this.filter) {
			this.resetFilter()
		} else {
			this.closeMenu()
		}
	}
	private handleEnter() {
		const item = menu.findFirstMarked(this.items)
		if (item?.value) {
			item.selected = !item.selected
		}
		if (!this.multiple) {
			this.closeMenu()
			this.resetFilter()
		}
	}
	private move(direction: -1 | 1): void {
		const { current, next } = menu.next(this.items, direction)
		current && (current.marked = false)
		next.marked = true
		scroll.centerInView(this.dropdownElement, next, "smooth")
	}
	private addItem() {
		this.addedItems = this.addedItems.concat(
			<smoothly-item value={this.filter} selected>
				{this.filter}
			</smoothly-item>
		)
	}
	private resetFilter() {
		this.searchElement && (this.searchElement.value = "")
		this.filter = ""
	}
	private setFilter(filter: string) {
		if (filter) {
			this.filter = filter
			this.openMenu()
		} else {
			this.resetFilter()
		}
	}
	private openMenu({ focus }: { focus?: boolean } = {}) {
		this.open = true
		focus && queueMicrotask(() => this.searchElement?.focus())
	}
	private closeMenu() {
		this.open = false
		this.resetFilter()
	}
	private toggleMenu() {
		if (!this.readonly && !this.disabled) {
			this.open ? this.closeMenu() : this.openMenu({ focus: true })
		}
	}

	render(): VNode | VNode[] {
		return (
			<Host
				class={{ "has-value": this.selected.length !== 0, open: this.open, "has-filter": this.filter !== "" }}
				onClick={(e: MouseEvent) => (e.stopPropagation(), this.toggleMenu())}>
				<div class="select-display" ref={element => (this.displayElement = element)}>
					{this.placeholder}
				</div>
				<div class="icons" ref={element => (this.iconsElement = element)} onClick={e => e.stopPropagation()}>
					<smoothly-icon class="smoothly-invalid" name="alert-circle" size="small" tooltip={this.errorMessage} />
					<slot name="end" />
					{this.looks == "border" && !this.readonly && (
						<smoothly-icon
							onClick={e => (e.stopPropagation(), this.toggleMenu())}
							ref={element => (this.toggleElement = element)}
							size="tiny"
							name={this.open ? "caret-down-outline" : "caret-forward-outline"}
						/>
					)}
				</div>
				<slot name="label" />
				<div class="dropdown" ref={(el: HTMLDivElement) => (this.dropdownElement = el)}>
					<div class="search">
						<smoothly-icon name="search-outline" size="small" />
						<input
							class="search-input"
							ref={el => (this.searchElement = el)}
							disabled={this.searchDisabled}
							onKeyDown={e => this.onKeyDown(e)}
							onInput={e => (e.stopPropagation(), this.setFilter(this.searchElement?.value ?? ""))}
							onPaste={e => (e.stopPropagation(), this.setFilter(this.searchElement?.value ?? ""))}
						/>
						<smoothly-icon
							name="backspace-outline"
							size="small"
							onClick={e => {
								e.stopPropagation()
								this.resetFilter()
								this.searchElement?.focus()
							}}
						/>
						{this.mutable && (
							<smoothly-icon
								name="add"
								size="small"
								onClick={e => {
									e.stopPropagation()
									this.addItem()
								}}
							/>
						)}
					</div>
					<div
						class="menu"
						hidden={!this.open}
						onClick={e => {
							e.stopPropagation()
							!this.multiple && this.closeMenu()
						}}>
						<slot />
						{this.addedItems}
					</div>
				</div>
			</Host>
		)
	}
}
