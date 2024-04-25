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
	@Element() element: HTMLSmoothlyInputSelectElement
	@Prop() name = "selected"
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop({ reflect: true, mutable: true }) showSelected?: boolean = true
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop() clearable = true
	@Prop({ mutable: true }) changed = false
	@Prop() placeholder?: string | any
	@Prop() menuHeight?: `${number}${"items" | "rem" | "px" | "vh"}`
	@State() opened = false
	items: HTMLSmoothlyItemElement[] = []
	@State() selectedElement?: HTMLSmoothlyItemElement
	@State() missing = false
	mainElement?: HTMLElement
	@State() filter = ""
	@Event() smoothlySelect: EventEmitter<unknown>
	@Event() smoothlyInput: EventEmitter<Data>
	aside?: HTMLElement
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
			(this.mainElement.innerHTML = this.initialValue ? this.initialValue.innerHTML : this.placeholder)
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
	async submit(): Promise<void> {
		this.initialValue = this.selectedElement
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
		if (!(await Promise.all(this.items.map(item => item.filter(value)))).some(r => r)) {
			this.missing = true
			this.items.forEach(el => el.filter(""))
		} else
			this.missing = false
	}
	@Watch("readonly")
	watchingReadonly(): void {
		this.listener.changed?.(this)
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
	}
	@Watch("opened")
	onClosed(): void {
		if (!this.opened) {
			const marked = this.items.find(item => item.marked)
			if (marked)
				marked.marked = false
		}
	}
	handleShowOptions(): void {
		!this.readonly && (this.opened = !this.opened)
	}

	@Listen("keydown")
	onKeyDown(event: KeyboardEvent) {
		event.stopPropagation()
		if (event.key != "Tab" && !event.ctrlKey && !event.metaKey)
			event.preventDefault()
		if (this.opened) {
			switch (event.key) {
				case "ArrowUp":
					this.move(-1)
					break
				case "ArrowDown":
					this.move(1)
					break
				case "Escape":
					if (this.filter == "")
						this.opened = false
					this.filter = ""
					break
				case "Backspace":
					this.filter = this.filter.slice(0, -1)
					break
				case "Enter":
					const result = this.items.find(item => item.marked)
					if (result?.value)
						result.selected = true
					this.opened = false
					this.filter = ""
					break
				case "Tab":
					this.opened = false
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
		this.items[markedIndex].focus()
	}
	render(): VNode | VNode[] {
		return (
			<Host tabIndex={0} class={{ missing: this.missing }}>
				<main ref={element => (this.mainElement = element)}>{this.placeholder ?? "(none)"}</main>
				{this.filter.length != 0 ? (
					<aside ref={element => (this.aside = element)}>
						{this.filter}
						<button
							onClick={e => {
								e.stopPropagation()
								this.filter = ""
							}}>
							<smoothly-icon name="close" size="small"></smoothly-icon>
						</button>
					</aside>
				) : undefined}
				{this.opened ? <section onClick={() => (this.opened = true)}></section> : []}
				<div class={this.opened ? "" : "hidden"}>
					<nav>
						<slot />
					</nav>
				</div>
			</Host>
		)
	}
	componentDidRender(): void | Promise<void> {
		const items: HTMLSmoothlyItemElement[] = []
		const children = this.element.querySelectorAll("div > nav > smoothly-item")
		for (let i = 0; i < children.length; i++) {
			const node = children.item(i)
			if (isItem(node)) {
				items.push(node)
				node.value == this.initialValue && this.mainElement && !this.selectedElement && (node.selected = true)
			}
		}
		this.items = items
		if (this.menuHeight)
			this.element?.style.setProperty(
				"--menu-height",
				!this.menuHeight.endsWith("items") || !this.items.length
					? this.menuHeight
					: `${this.items[0].clientHeight * +(this.menuHeight.match(/^(\d+(\.\d+)?|\.\d+)/g)?.[0] ?? "10")}px`
			)
	}
}
function isItem(value: HTMLSmoothlyItemElement | any): value is HTMLSmoothlyItemElement {
	return (
		typeof value == "object" &&
		(typeof value.selected == "boolean" || value.selected == undefined) &&
		typeof value.filter == "function"
	)
}
