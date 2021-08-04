import { Component, Element, Event, EventEmitter, h, Host, Listen, State, Watch } from "@stencil/core"
@Component({
	tag: "smoothly-selector",
	styleUrl: "style.css",
	scoped: true,
})
export class Selector {
	@Element() element: HTMLSmoothlySelectorElement
	@State() opened = false
	@State() items: HTMLSmoothlyItemElement[] = []
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
		console.log("selector selected", value?.value)
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
	@Listen("itemLoaded")
	onItemLoaded(event: Event) {
		this.items.push(event.target as HTMLSmoothlyItemElement)
	}
	@Listen("itemSelected")
	onItemSelected(event: Event) {
		this.selectedElement = event.target as HTMLSmoothlyItemElement
		if (this.mainElement)
			this.mainElement.innerHTML = this.selectedElement.innerHTML
	}
	@Listen("keydown")
	onKeyDown(event: KeyboardEvent) {
		console.log("key", event.key)
		let move = 0
		switch (event.key) {
			case "ArrowUp":
				move = -1
				break
			case "ArrowDown":
				move = 1
				break
			case "Escape":
				this.filter = ""
				break
			case "Backspace":
				this.filter = this.filter.slice(0, -1)
				break
			case "Enter":
				this.selected?.emit(this.selectedElement)
				break
			default:
				if (event.key.length == 1)
					this.filter += event.key
				break
		}
		if (move) {
			let selectedIndex = this.items.findIndex(item => item == this.selectedElement)
			if (selectedIndex == -1)
				selectedIndex = 0
			;(this.selectedElement = this.items[
				(selectedIndex + move + this.items.length) % this.items.length
			]).selected = true
		}
	}
	render() {
		return (
			<Host tabIndex={2} class={this.missing ? "missing" : ""}>
				<main ref={element => (this.mainElement = element)}>(none)</main>
				{this.filter.length != 0 ? (
					<aside ref={element => (this.aside = element)}>
						{this.filter}
						<button onClick={() => (this.filter = "")}>
							<smoothly-icon name="close" size="small"></smoothly-icon>
						</button>
					</aside>
				) : undefined}
				<nav style={{ display: !this.opened ? "none" : "flex" }}>
					<slot />
				</nav>
			</Host>
		)
	}
}
