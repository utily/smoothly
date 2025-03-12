import {
	Component,
	ComponentWillLoad,
	Element,
	Event,
	EventEmitter,
	h,
	Host,
	Listen,
	Prop,
	State,
	VNode,
	Watch,
} from "@stencil/core"
import { Color, Data } from "../../../model"
import { Item } from "../../item/Item"
import { Editable } from "../Editable"
import { Looks } from "../Looks"

@Component({
	tag: "smoothly-input-scroll-picker",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputScrollPicker implements ComponentWillLoad {
	parent: Editable | undefined
	private displaySelectedElement?: HTMLElement
	private iconsDiv?: HTMLElement
	private toggle?: HTMLElement
	private optionsDiv?: HTMLDivElement
	private items: HTMLSmoothlyItemElement[] = []
	private itemHeight: number | undefined
	@Element() element: HTMLSmoothlyInputSelectElement
	@Prop() invalid?: boolean = false
	@Prop() min!: number
	@Prop() max!: number
	@Prop() value!: number
	@State() index?: number
	@Prop({ reflect: true }) name = "selected"
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true }) showLabel = true
	@Prop({ reflect: true, mutable: true }) showSelected?: boolean = true
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ reflect: true }) inCalendar = false
	@Prop() multiple = false
	@Prop() clearable = true
	@Prop({ mutable: true }) defined = false
	@Prop({ reflect: true }) placeholder?: string | any
	@Prop() menuHeight?: `${number}${"items" | "rem" | "px" | "vh"}`
	@Prop() required = false
	@Prop() searchDisabled = false
	@Prop() mutable = false
	@State() open = false
	@State() selected: HTMLSmoothlyItemElement[] = []
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
	}
	@Watch("open")
	onClosed(): void {
		if (!this.open) {
			const markedItem = this.items.find(item => item.marked)
			if (markedItem)
				markedItem.marked = false
		}
	}
	handleShowOptions(event?: Event): void {
		const wasButtonClicked =
			event?.composedPath().some(e => e == this.iconsDiv) && !event.composedPath().some(e => e == this.toggle)
		const clickedItem = event
			?.composedPath()
			.find((el): el is HTMLSmoothlyItemElement => "tagName" in el && el.tagName == "SMOOTHLY-ITEM")
		!this.readonly &&
			!(clickedItem && this.items.includes(clickedItem) && this.multiple) &&
			!wasButtonClicked &&
			(this.open = !this.open)
	}
	areValuesEqual(selected: HTMLSmoothlyItemElement[], initialValue: HTMLSmoothlyItemElement[]): boolean {
		return selected.length === initialValue.length && initialValue.every(value => selected.includes(value))
	}
	displaySelected(): void {
		const displayString: string = "<div>" + this.selected.map(option => option.innerHTML).join("</div><div>") + "</div>"
		this.displaySelectedElement &&
			(this.displaySelectedElement.innerHTML =
				this.selected.length > 0 ? displayString : this.placeholder ? this.placeholder : "")
	}
	@Listen("smoothlyInputLoad")
	async smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputScrollPicker) => void>): Promise<void> {
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
		event.detail(this)
	}
	onWheel(e: WheelEvent) {
		e.preventDefault()
		// e.deltaY > 0
		// 	? (this.index = Math.min(this.items.length - 1, (this.index ?? 0) + 1))
		// 	: (this.index = Math.max(0, (this.index ?? 0) - 1))
		e.deltaY > 0 ? this.value++ : this.value--
	}

	// @Watch("index")
	// indexChange() {
	// 	if (typeof this.index == "number") {
	// 		const item = this.items[this.index]
	// 		console.log("index change", this.index, item)
	// 		item && this.scrollTo(item)
	// 		this.items.map(item => (item.marked = false))
	// 		item.marked = true
	// 	}
	// }
	// scrollTo(item: HTMLElement) {
	// 	this.optionsDiv?.scrollTo({
	// 		behavior: "smooth",
	// 		top: item.offsetTop + item.offsetHeight - (this.optionsDiv?.clientHeight ?? 0) / 2,
	// 	})
	// }
	componentDidLoad() {
		// if (this.optionsDiv) {
		// 	const range = 5
		// 	const divs: HTMLElement[] = []
		// 	for (let i = this.value - range; i < this.value + range; i++) {
		// 		const div = document.createElement("div")
		// 		div.replace()
		// 	}
		// 	this.optionsDiv.replaceChildren()
		// }
	}

	render(): VNode | VNode[] {
		return (
			<Host
				tabIndex={0}
				class={{
					"has-value": this.selected.length !== 0,
					open: this.open,
					invalid: !!this.invalid,
				}}
				style={{ "--menu-height": "20rem" }}
				onClick={(event: Event) => this.handleShowOptions(event)}>
				<div class="select-display" ref={element => (this.displaySelectedElement = element)}>
					{this.placeholder}
				</div>
				<div
					class={{ /* hidden: !this.open, */ options: true }}
					ref={(el: HTMLDivElement) => (this.optionsDiv = el)}
					onWheel={e => this.onWheel(e)}
					onTouchStart={e => {}}
					onTouchMove={e => {}}>
					{Array.from({ length: 7 })
						.map((_, i) => i + this.value - 3)
						.map(value => (
							<div key={value} class={{ item: true, selected: value == this.value }}>
								{value}
							</div>
						))}
				</div>
			</Host>
		)
	}
}
