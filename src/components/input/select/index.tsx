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

@Component({
	tag: "smoothly-input-select",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputSelect implements Input, Editable, Clearable, ComponentWillLoad {
	parent: Editable | undefined
	private initialValue: HTMLSmoothlyItemElement[] = []
	private initialValueHandled = false
	private observer = Editable.Observer.create(this)
	private displaySelectedElement?: HTMLElement
	private iconsDiv?: HTMLElement
	private toggle?: HTMLElement
	private optionsDiv?: HTMLDivElement
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
	@Prop() multiple = false
	@Prop() clearable = true
	@Prop({ mutable: true }) changed = false
	@Prop({ mutable: true }) defined = false
	@Prop({ reflect: true }) placeholder?: string | any
	@Prop() menuHeight?: `${number}${"items" | "rem" | "px" | "vh"}`
	@Prop() required = false
	@Prop() searchDisabled = false
	@Prop() mutable = false
	private lastOpen = false
	@State() open = false
	@State() selected: HTMLSmoothlyItemElement[] = []
	@State() filter = ""
	@State() addedItems: HTMLSmoothlyItemElement[] = []
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	@Event() smoothlyItemSelect: EventEmitter<HTMLSmoothlyItemElement>

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
		this.itemHeight === undefined && (this.itemHeight = this.items.find(item => item.clientHeight > 0)?.clientHeight)
		if (this.menuHeight && this.itemHeight) {
			this.element?.style.setProperty(
				"--menu-height",
				!this.menuHeight.endsWith("items") || this.items.length == 0
					? this.menuHeight
					: `${this.itemHeight * +(this.menuHeight.match(/^(\d+(\.\d+)?|\.\d+)/g)?.[0] ?? "10")}px`
			)
		}
		this.element?.style.setProperty("--element-height", `${this.element.clientHeight}px`)

		if (this.ordered && !this.multiple && this.open && !this.lastOpen) {
			this.scrollToSelected()
		}
	}
	async disconnectedCallback() {
		if (!this.element.isConnected)
			await this.unregister()
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
		this.changed = false
		this.open && this.handleShowOptions()
	}

	@Method()
	async clear(): Promise<void> {
		if (this.clearable) {
			this.selected.forEach(item => (item.selected = item.hidden = false))
			this.selected = []
			if (this.displaySelectedElement) {
				this.displaySelectedElement.innerHTML = this.placeholder ?? ""
			}
		}
	}
	@Method()
	async edit(editable: boolean): Promise<void> {
		this.readonly = !editable
	}
	@Method()
	async setInitialValue(): Promise<void> {
		this.changed = false
		this.initialValue = [...this.selected]
	}
	@Watch("selected")
	async onSelectedChange() {
		this.initialValueHandled && (this.changed = !this.areValuesEqual(this.selected, this.initialValue))
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
				(event.composedPath().some(e => e == this.iconsDiv) && !event.composedPath().some(e => e == this.toggle)))
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
	onWindowClick(event: Event): void {
		!event.composedPath().includes(this.element) && this.open && this.handleShowOptions()
	}
	@Listen("smoothlyItemDOMChange")
	onItemDomChange(e: CustomEvent) {
		e.stopPropagation()
		const item = e.target as HTMLSmoothlyItemElement
		if (item.selected)
			this.displaySelected()
	}
	@Listen("smoothlyItemSelect")
	onItemSelect(event: CustomEvent<HTMLSmoothlyItemElement>): void {
		event.stopPropagation()
		if (this.multiple) {
			this.selected = event.detail.selected
				? [...this.selected, event.detail]
				: this.selected.filter(item => item.selected)
		} else if (event.detail.selected || !this.items.some(e => e.selected)) {
			this.selected[0] && (this.selected[0].hidden = this.selected[0].selected = false)
			this.selected = !event.detail.selected ? this.selected.filter(item => item.selected) : [event.detail]
			!this.showSelected && event.detail.selected && (event.detail.hidden = true)
		}
		this.displaySelected()
	}
	@Watch("open")
	onClosed(open: boolean, before: boolean): void {
		this.lastOpen = before
		if (!open) {
			const markedItem = this.items.find(item => item.marked)
			if (markedItem) {
				markedItem.marked = false
			}
		}
	}
	handleShowOptions(event?: Event): void {
		const wasButtonClicked =
			event?.composedPath().some(e => e == this.iconsDiv) && !event.composedPath().some(e => e == this.toggle)
		const clickedItem = event
			?.composedPath()
			.find((el): el is HTMLSmoothlyItemElement => "tagName" in el && el.tagName == "SMOOTHLY-ITEM")
		!this.readonly &&
			!this.disabled &&
			!(clickedItem && this.items.includes(clickedItem) && this.multiple) &&
			!wasButtonClicked &&
			(this.open = !this.open)
		this.filter = ""
	}
	areValuesEqual(selected: HTMLSmoothlyItemElement[], initialValue: HTMLSmoothlyItemElement[]): boolean {
		return selected.length === initialValue.length && initialValue.every(value => selected.includes(value))
	}
	displaySelected(): void {
		const displayString: string = this.selected.map(option => `<div>${option.innerHTML}</div>`).join("")
		this.displaySelectedElement &&
			(this.displaySelectedElement.innerHTML = this.selected.length > 0 ? displayString : this.placeholder ?? "")
	}
	@Listen("keydown")
	onKeyDown(event: KeyboardEvent) {
		if (!this.searchDisabled) {
			event.stopPropagation()
			const visibleItems = this.items.some(item => item.getAttribute("hidden") === null)
			if (event.key != "Tab" && !event.ctrlKey && !event.metaKey)
				event.preventDefault()
			if (this.open) {
				switch (event.key) {
					case "ArrowUp":
						visibleItems && this.move(-1)
						break
					case "ArrowDown":
						visibleItems && this.move(1)
						break
					case "Escape":
						if (this.filter == "")
							this.open = false
						else
							this.filter = ""
						break
					case "Backspace":
						this.filter = event.ctrlKey ? "" : this.filter.slice(0, -1)
						break
					case "Enter":
						const result = this.items.find(item => item.marked)
						if (result?.value)
							result.selected = !result.selected
						if (!this.multiple) {
							this.open = false
							this.filter = ""
						}
						break
					case "Tab":
						this.open = false
						break
					default:
						if (event.key.length == 1)
							this.filter += event.key
						break
				}
			} else {
				switch (event.key) {
					case "Enter":
					case " ":
						this.handleShowOptions()
						break
					case "ArrowDown":
						this.handleShowOptions()
						this.move(1)
						break
					case "ArrowUp":
						this.handleShowOptions()
						this.move(-1)
						break
					case "Tab":
						break
					default:
						this.handleShowOptions()
						if (event.key.length == 1)
							this.filter += event.key
						break
				}
			}
		}
	}
	private scrollToSelected() {
		const selectedItem = this.items.find(item => item.selected)
		if (selectedItem) {
			this.items.map(item => (item.marked = false))
			selectedItem.marked = true
			this.scrollTo(selectedItem, "instant")
		}
	}
	private move(direction: -1 | 1): void {
		const selectableItems = this.items.filter(item => !item.hidden && !item.disabled)
		let markedIndex = selectableItems.findIndex(item => item.marked)
		if (markedIndex == -1)
			markedIndex = 0
		else {
			selectableItems[markedIndex].marked = false
			markedIndex = (markedIndex + direction + selectableItems.length) % selectableItems.length
		}
		selectableItems[markedIndex].marked = true
		this.scrollTo(selectableItems[markedIndex], "smooth")
	}
	private scrollTo(item: HTMLSmoothlyItemElement, behavior?: "instant" | "smooth") {
		this.optionsDiv?.scrollTo({
			top: item.offsetTop + item.offsetHeight / 2 - (this.optionsDiv?.clientHeight ?? 0) / 2,
			behavior,
		})
	}
	private addItem() {
		this.addedItems = this.addedItems.concat(
			<smoothly-item value={this.filter} selected>
				{this.filter}
			</smoothly-item>
		)
	}

	render(): VNode | VNode[] {
		return (
			<Host
				tabIndex={this.disabled ? undefined : 0}
				class={{ "has-value": this.selected.length !== 0, open: this.open }}
				onClick={(event: Event) => this.handleShowOptions(event)}>
				<div class="select-display" ref={element => (this.displaySelectedElement = element)}>
					{this.placeholder}
				</div>
				<div class="icons" ref={element => (this.iconsDiv = element)}>
					<smoothly-icon
						class="smoothly-invalid"
						name="alert-circle"
						color="danger"
						fill="clear"
						size="small"
						toolTip={this.errorMessage}
					/>
					<slot name="end" />
					{this.looks == "border" && !this.readonly && (
						<smoothly-icon
							ref={element => (this.toggle = element)}
							size="tiny"
							name={this.open ? "caret-down-outline" : "caret-forward-outline"}
						/>
					)}
				</div>
				<slot name="label" />
				<div class={{ hidden: !this.open, options: true }} ref={(el: HTMLDivElement) => (this.optionsDiv = el)}>
					{this.filter.length > 0 && (
						<div class="search-preview">
							<smoothly-icon name="search-outline" size="small" />
							{this.filter}
							<smoothly-icon
								name="backspace-outline"
								size="small"
								onClick={e => {
									e.stopPropagation()
									this.filter = ""
									this.element.focus()
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
					)}
					<slot />
					{this.addedItems}
				</div>
			</Host>
		)
	}
}
