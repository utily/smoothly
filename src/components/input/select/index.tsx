import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { Color, Data } from "../../../model"
import { Input } from "../Input"
import { Looks } from "../Looks"
@Component({
	tag: "smoothly-input-select",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputSelect implements Input {
	@Element() element: HTMLSmoothlyInputSelectElement
	@Prop() name = "selected"
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop({ reflect: true, mutable: true }) type?: "icon"
	@Prop({ reflect: true, mutable: true }) showSelected?: boolean = true
	@Prop() initialPrompt?: string
	@Prop() initialValue?: unknown
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

	componentWillLoad() {
		this.smoothlyInputLooks.emit((looks, color) => ((this.looks = looks), !this.color && (this.color = color)))
	}

	@Method()
	async reset() {
		this.selectedElement = undefined
		if (this.mainElement) {
			//reset to the same value as it started with
			this.mainElement.innerHTML = this.initialPrompt ?? "(none)"
		}
	}

	@Watch("selectedElement")
	onSelectedChange(value: HTMLSmoothlyItemElement | undefined, old: HTMLSmoothlyItemElement | undefined) {
		if (old)
			old.selected = false
		this.smoothlySelect.emit(value?.value)
		this.smoothlyInput.emit({ [this.name]: value?.value })
	}
	@Watch("filter")
	async onFilterChange(value: string) {
		value = value.toLowerCase()
		if (!(await Promise.all(this.items.map(item => item.filter(value)))).some(r => r)) {
			this.missing = true
			this.items.forEach(el => el.filter(""))
		} else
			this.missing = false
	}
	@Listen("click")
	onClick(event: UIEvent) {
		event.stopPropagation()
		this.opened = !this.opened
	}
	@Listen("smoothlyItemSelect")
	onItemSelect(event: Event) {
		this.selectedElement && (this.selectedElement.hidden = false)
		this.selectedElement = event.target as HTMLSmoothlyItemElement
		!this.showSelected && (this.selectedElement.hidden = true)
		if (this.mainElement)
			this.mainElement.innerHTML = this.selectedElement.innerHTML
	}
	@Watch("opened")
	onClosed() {
		if (!this.opened) {
			const marked = this.items.find(item => item.marked)
			if (marked)
				marked.marked = false
		}
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
					this.opened = true
					break
				case "ArrowDown":
					this.opened = true
					this.move(0)
					break
				case "ArrowUp":
					this.opened = true
					this.move(-1)
					break
				case "Tab":
					break
				default:
					this.opened = true
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
	render() {
		return (
			<Host tabIndex={0} class={(this.missing ? "missing" : this.type) ?? ""}>
				<main ref={element => (this.mainElement = element)}>{this.initialPrompt ?? "(none)"}</main>
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
	componentDidRender() {
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
		if (this.menuHeight?.endsWith("items") && this.items.length)
			this.element?.style.setProperty(
				"--menu-height",
				`${this.items[0].clientHeight * +this.menuHeight.replace(/[a-z]/g, "")}px`
			)
		else if (this.menuHeight)
			this.element?.style.setProperty("--menu-height", this.menuHeight)
	}
}
function isItem(value: HTMLSmoothlyItemElement | any): value is HTMLSmoothlyItemElement {
	return (
		typeof value == "object" &&
		(typeof value.selected == "boolean" || value.selected == undefined) &&
		typeof value.filter == "function"
	)
}
