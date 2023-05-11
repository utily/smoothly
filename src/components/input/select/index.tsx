import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
@Component({
	tag: "smoothly-input-select",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputSelect {
	@Element() element: HTMLSmoothlyInputSelectElement
	@Prop() value?: string
	@Prop() defaultValue?: string
	@Prop() label?: string
	@State() opened = false
	@State() selectedElement?: HTMLSmoothlyItemElement
	@State() missing = false
	@State() filter = ""
	@Event() selected: EventEmitter<any>
	items: HTMLSmoothlyItemElement[] = []
	input?: HTMLSmoothlyInputElement

	@Method()
	async reset() {
		this.selectedElement = undefined
		if (this.input)
			this.input.value = this.defaultValue || ""
	}

	// cOMPONENTwILLlOAD FÅR SÄTTA DEFAULTvALUE OM DET ÄR SATT
	@Watch("filter")
	async onFilterChange(value: string) {
		value = value.toLowerCase()
		if (!(await Promise.all(this.items.map(item => item.filter(value)))).some(r => r)) {
			this.missing = true
			this.items.forEach(el => el.filter(""))
		} else
			this.missing = false
	}

	@Watch("selectedElement")
	onSelectedChange(value: HTMLSmoothlyItemElement | undefined, old: HTMLSmoothlyItemElement | undefined) {
		if (old)
			old.selected = false
		this.selected.emit(value?.value)
	}
	@Listen("click")
	onClick(event: UIEvent) {
		event.stopPropagation()
		this.opened = !this.opened
	}
	@Listen("itemSelected")
	onItemSelected(event: Event) {
		this.selectedElement = event.target as HTMLSmoothlyItemElement
		if (this.input)
			this.input.value = this.selectedElement.textContent
		this.value = this.selectedElement.value
	}
	@Watch("opened")
	onClosed() {
		if (!this.opened) {
			const selected = this.items.find(item => item.marked)
			if (selected)
				selected.marked = false
		}
	}
	private setSelected() {
		this.value = ""
		this.items.forEach(item => {
			if (item.textContent === this.filter) {
				item.selected = true
				this.value = item.value
			} else {
				item.selected = false
			}
		})
	}
	@Listen("keydown")
	onKeyDown(event: KeyboardEvent) {
		event.stopPropagation()
		event.preventDefault()
		if (this.opened) {
			let direction: -1 | 0 | 1 = 0
			switch (event.key) {
				case "ArrowUp":
					direction = -1
					break
				case "ArrowDown":
					direction = 1
					break
				case "Escape":
					this.filter = ""
					break
				case "Backspace":
					this.filter = this.filter.slice(0, -1)
					this.setSelected()
					break
				case "Enter":
					const result = this.items.find(item => item.marked)
					if (result?.value) {
						result.selected = true
						this.value = result.value
					}
					this.opened = false
					this.filter = ""
					break
				default:
					if (event.key.length == 1 && event.key !== ("ArrowRight" || "ArrowLeft")) {
						this.filter += event.key
						this.setSelected()
					}
					break
			}
			this.move(direction)
		} else if (event.key == "Enter")
			this.opened = true
	}
	private move(direction: -1 | 0 | 1): void {
		if (direction) {
			let markedIndex = this.items.findIndex(item => item.marked)
			if (markedIndex == -1)
				markedIndex = this.items.findIndex(item => item.selected)
			if (this.items[markedIndex])
				this.items[markedIndex].marked = false
			do {
				markedIndex = (markedIndex + direction + this.items.length) % this.items.length
			} while (this.items[markedIndex].hidden)
			this.items[markedIndex].marked = true
			this.items[markedIndex].focus()
		}
	}
	render() {
		return (
			<Host tabIndex={2} class={this.missing ? "missing" : ""}>
				<smoothly-input value={this.filter} ref={el => (this.input = el)} type="text" name={this.value}>
					{this.label}
				</smoothly-input>
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
			if (isItem(node))
				items.push(node)
		}
		this.items = items
	}
}
function isItem(value: HTMLSmoothlyItemElement | any): value is HTMLSmoothlyItemElement {
	return (
		typeof value == "object" &&
		(typeof value.selected == "boolean" || value.selected == undefined) &&
		typeof value.filter == "function"
	)
}
