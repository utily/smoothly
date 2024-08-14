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
import { Color, Data } from "../../model"
import { Looks } from "../input/Looks"
import { Item } from "../item/Item"
@Component({
	tag: "smoothly-menu",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputSelect implements ComponentWillLoad {
	private items: HTMLSmoothlyItemElement[] = []
	private itemHeight: number | undefined
	@Element() element: HTMLSmoothlyInputSelectElement
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop() height?: `${number}${"items" | "rem" | "px" | "vh"}`
	@Prop() searchable = false
	@State() selected: HTMLSmoothlyItemElement[] = []
	@State() filter = ""
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>

	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit((looks, color) => ((this.looks = looks), !this.color && (this.color = color)))
	}
	componentDidRender(): void | Promise<void> {
		if (this.height && !this.height.endsWith("items")) {
			this.element?.style.setProperty("--menu-height", this.height)
		} else if (this.height) {
			this.itemHeight === undefined && (this.itemHeight = this.items.find(item => item.clientHeight > 0)?.clientHeight)
			if (this.itemHeight) {
				const height = `${this.itemHeight * +(this.height.match(/^(\d+(\.\d+)?|\.\d+)/g)?.[0] ?? "10")}px`
				this.element?.style.setProperty("--menu-height", height)
			}
		}
	}
	@Method()
	async getItems(): Promise<HTMLSmoothlyItemElement[]> {
		return this.items
	}
	@Watch("filter")
	async onFilterChange(value: string): Promise<void> {
		if (this.searchable) {
			value = value.toLowerCase()
			await Promise.all(this.items.map(item => item.filter(value)))
		}
	}
	@Listen("smoothlyInputLoad")
	async smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputSelect) => void>): Promise<void> {
		if (Item.Element.is(event.target)) {
			event.stopPropagation()
			this.items.push(event.target as HTMLSmoothlyItemElement)
		}
		event.detail(this)
	}
	@Listen("keydown")
	@Method()
	onKeyDown(event: KeyboardEvent) {
		event.stopPropagation()
		const visibleItems = this.items.some(item => item.getAttribute("hidden") === null)
		switch (event.key) {
			case "ArrowUp":
				visibleItems && this.move(-1)
				break
			case "ArrowDown":
				visibleItems && this.move(1)
				break
			case "Escape":
				this.filter = ""
				break
			case "Backspace":
				this.filter = this.filter.slice(0, -1)
				break
			case "Enter":
				const result = this.items.find(item => item.marked)
				result && (result.selected = !result.selected)
				break
			case "Tab":
				break
			case " ":
				if (this.filter.length > 0)
					this.filter += event.key
				break
			default:
				if (event.key.length == 1)
					this.filter += event.key
				break
		}
	}
	private move(direction: -1 | 1): void {
		let markedIndex = this.items.findIndex(item => item.marked)
		if (markedIndex == -1)
			markedIndex = 0
		else {
			this.items[markedIndex].marked = false
			markedIndex = (markedIndex + direction + this.items.length) % this.items.length
		}
		if (this.items.some(item => !item.hidden))
			while (this.items[markedIndex].hidden) {
				markedIndex = (markedIndex + direction + this.items.length) % this.items.length
			}
		this.items[markedIndex].marked = true
		this.scrollTo(this.items[markedIndex])
	}
	private scrollTo(item: HTMLSmoothlyItemElement) {
		this.element?.scrollTo({ top: item.offsetTop - (this.element?.clientHeight ?? 0) / 2 })
	}

	render(): VNode | VNode[] {
		return (
			<Host>
				{this.filter.length > 0 && this.searchable && (
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
						<slot name="filter-end"></slot>
					</smoothly-item>
				)}
				<slot />
			</Host>
		)
	}
}
