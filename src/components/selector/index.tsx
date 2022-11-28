import { Component, Element, Event, EventEmitter, h, Host, Listen, State, Watch } from "@stencil/core"
@Component({
	tag: "smoothly-selector",
	styleUrl: "style.css",
	scoped: true,
})
export class Selector {
	@Element() element: HTMLSmoothlySelectorElement
	@State() opened = false
	items: HTMLSmoothlyItemElement[] = []
	@State() selectedElement?: HTMLSmoothlyItemElement
	@State() missing = false
	mainElement?: HTMLElement
	@State() filter = ""
	@Event() selected: EventEmitter<any>
	aside?: HTMLElement
	@Watch("selectedElement")
	onSelectedChange(value: HTMLSmoothlyItemElement | undefined, old: HTMLSmoothlyItemElement | undefined) {
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
		this.selectedElement = event.target as HTMLSmoothlyItemElement
		if (this.mainElement)
			this.mainElement.innerHTML = this.selectedElement.innerHTML
	}

	@Listen("keydown")
	onKeyDown(event: KeyboardEvent) {
		event.stopPropagation()
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
					const result = this.items.find(item => item.selected)
					this.selected.emit(result?.value)
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
	private move(direction: -1 | 0 | 1): void {
		if (direction) {
			let selectedIndex = this.items.findIndex(item => item == this.selectedElement)
			do {
				selectedIndex = (selectedIndex + direction + this.items.length) % this.items.length
			} while (this.items[selectedIndex].hidden)
			console.log("selectedindex", selectedIndex)
			this.selectedElement = this.items[selectedIndex]
			this.selectedElement.selected = true
		}
	}
	render() {
		return (
			<Host tabIndex={2} class={this.missing ? "missing" : ""}>
				<main ref={element => (this.mainElement = element)}>(none)</main>
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
