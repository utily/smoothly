import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
@Component({
	tag: "smoothly-0-selector",
	styleUrl: "style.css",
	scoped: true,
})
export class Selector {
	@Element() element: HTMLSmoothly0SelectorElement
	@Prop() initialPrompt?: string
	@Prop() disableFilter = false
	@State() opened = false
	items: HTMLSmoothly0ItemElement[] = []
	@State() selectedElement?: HTMLSmoothly0ItemElement
	@State() missing = false
	mainElement?: HTMLElement
	@State() filter = ""
	@Event() selected: EventEmitter<any>
	aside?: HTMLElement

	@Method()
	async reset() {
		this.selectedElement = undefined
		if (this.mainElement) {
			//reset to the same value as it started with
			this.mainElement.innerHTML = this.initialPrompt ?? "(none)"
		}
	}

	@Watch("selectedElement")
	onSelectedChange(value: HTMLSmoothly0ItemElement | undefined, old: HTMLSmoothly0ItemElement | undefined) {
		if (old)
			old.selected = false
		this.selected.emit(value?.value)
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
	@Listen("itemSelected")
	onItemSelected(event: Event) {
		this.selectedElement = event.target as HTMLSmoothly0ItemElement
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
		if (!this.disableFilter) {
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
						break
					case "Enter":
						const result = this.items.find(item => item.marked)
						if (result?.value) {
							result.selected = true
						}
						this.opened = false
						this.filter = ""
						break
					default:
						if (event.key.length == 1)
							this.filter += event.key
						break
				}
				this.move(direction)
			} else if (event.key == "Enter")
				this.opened = true
		}
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
				<main ref={element => (this.mainElement = element)}>{this.initialPrompt ?? "(none)"}</main>
				{this.filter.length != 0 ? (
					<aside ref={element => (this.aside = element)}>
						{this.filter}
						<button
							onClick={e => {
								e.stopPropagation()
								this.filter = ""
							}}>
							<smoothly-0-icon name="close" size="small"></smoothly-0-icon>
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
		const items: HTMLSmoothly0ItemElement[] = []
		const children = this.element.querySelectorAll("div > nav > smoothly-0-item")
		for (let i = 0; i < children.length; i++) {
			const node = children.item(i)
			if (isItem(node))
				items.push(node)
		}
		this.items = items
	}
}
function isItem(value: HTMLSmoothly0ItemElement | any): value is HTMLSmoothly0ItemElement {
	return (
		typeof value == "object" &&
		(typeof value.selected == "boolean" || value.selected == undefined) &&
		typeof value.filter == "function"
	)
}
