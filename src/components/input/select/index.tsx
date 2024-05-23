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
	private initialValue?: HTMLSmoothlyItemElement | undefined
	private initialValueHandled = false
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	items: HTMLSmoothlyItemElement[] = []
	itemHeight: number | undefined
	mainElement?: HTMLElement
	@Element() element: HTMLSmoothlyInputSelectElement
	@Prop() name = "selected"
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop({ reflect: true, mutable: true }) showSelected?: boolean = true
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop() clearable = true
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true }) placeholder?: string | any
	@Prop() menuHeight?: `${number}${"items" | "rem" | "px" | "vh"}`
	@State() open = false
	@State() selectedElement?: HTMLSmoothlyItemElement
	@State() filter = ""
	@Event() smoothlySelect: EventEmitter<unknown>
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>

	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit(looks => (this.looks = looks))
		this.smoothlyInputLoad.emit(() => {
			return
		})
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.listener.changed?.(this)
	}
	componentDidLoad(): void | Promise<void> {
		this.selectedElement && !this.initialValueHandled && (this.initialValue = this.selectedElement)
		this.initialValueHandled = true
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
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>): Promise<void> {
		this.listener[property] = listener
		listener(this)
	}
	@Method()
	async reset(): Promise<void> {
		this.changed = false
		this.selectedElement && (this.selectedElement.hidden = false)
		this.mainElement &&
			(this.mainElement.innerHTML =
				this.initialValue !== undefined ? this.initialValue.innerHTML : this.placeholder ? this.placeholder : "")
		this.selectedElement = this.initialValue
		this.selectedElement && !this.showSelected && (this.selectedElement.hidden = true)
	}

	@Method()
	async clear(): Promise<void> {
		if (this.clearable) {
			this.selectedElement = undefined
			if (this.mainElement) {
				this.mainElement.innerHTML = this.placeholder ?? "(none)"
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
		this.initialValue = this.selectedElement
		this.smoothlyInput.emit({ [this.name]: this.selectedElement?.value })
	}
	@Watch("selectedElement")
	onSelectedChange(value: HTMLSmoothlyItemElement | undefined, old: HTMLSmoothlyItemElement | undefined): void {
		this.initialValueHandled && (this.changed = this.initialValue !== this.selectedElement)
		if (old)
			old.selected = false
		this.smoothlySelect.emit(value?.value)
		this.smoothlyInput.emit({ [this.name]: value?.value })
		this.listener.changed?.(this)
	}
	@Watch("filter")
	async onFilterChange(value: string): Promise<void> {
		value = value.toLowerCase()
		await Promise.all(this.items.map(item => item.filter(value)))
	}
	@Watch("readonly")
	watchingReadonly(): void {
		this.listener.changed?.(this)
	}
	@Listen("smoothlyInputLoad")
	async smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputSelect) => void>): Promise<void> {
		if (event.target && "name" in event.target && event.target.name !== this.name) {
			event.stopPropagation()
		} else if (Item.type.is(event.target)) {
			event.stopPropagation()
			this.items.push(event.target as HTMLSmoothlyItemElement)
		}
		event.detail(this)
	}
	@Listen("click")
	onClick(event: UIEvent): void {
		event.stopPropagation()
		this.handleShowOptions()
	}
	@Listen("smoothlyItemSelect")
	onItemSelect(event: Event): void {
		this.selectedElement && (this.selectedElement.hidden = false)
		this.selectedElement = event.target as HTMLSmoothlyItemElement
		!this.showSelected && (this.selectedElement.hidden = true)
		this.mainElement && this.selectedElement && (this.mainElement.innerHTML = this.selectedElement.innerHTML)
		this.element.focus()
	}
	@Watch("open")
	onClosed(): void {
		if (!this.open) {
			const marked = this.items.find(item => item.marked)
			if (marked)
				marked.marked = false
		}
	}
	handleShowOptions(): void {
		!this.readonly && (this.open = !this.open)
		this.filter = ""
	}

	@Listen("keydown")
	onKeyDown(event: KeyboardEvent) {
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
					this.filter = this.filter.slice(0, -1)
					break
				case "Enter":
					const result = this.items.find(item => item.marked)
					if (result?.value)
						result.selected = true
					this.open = false
					this.filter = ""
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
					this.move(0)
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
	private move(direction: -1 | 0 | 1): void {
		let markedIndex = this.items.findIndex(item => item.marked)
		if (markedIndex == -1)
			markedIndex = this.items.findIndex(item => item.selected)
		if (this.items[markedIndex])
			this.items[markedIndex].marked = false
		if (markedIndex == -1)
			markedIndex = 0
		do {
			markedIndex = (markedIndex + direction + this.items.length) % this.items.length
		} while (this.items[markedIndex].hidden)
		this.items[markedIndex].marked = true
	}
	render(): VNode | VNode[] {
		return (
			<Host tabIndex={0} class={{ "has-value": this.selectedElement ? true : false }}>
				<div class="select-display">
					<div class="selected-value" ref={element => (this.mainElement = element)}>
						{this.placeholder}
					</div>
				</div>
				<div class="icons">
					<slot name="end" />
					<smoothly-icon size="tiny" name={this.open ? "caret-down-outline" : "caret-forward-outline"} />
				</div>
				<slot name="label" />
				{this.open && <section onClick={() => (this.open = true)} />}
				<div class={`${this.open ? "" : "hidden"} options`}>
					{this.filter.length > 0 && (
						<smoothly-item selectable={false}>
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
						</smoothly-item>
					)}
					<slot />
				</div>
			</Host>
		)
	}
}
