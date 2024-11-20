import {
	Component,
	ComponentWillLoad,
	Element,
	Event,
	EventEmitter,
	h,
	Host,
	Prop,
	State,
	VNode,
	Watch,
} from "@stencil/core"
import { Color, Data } from "../../../model"
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
		this.filter = ""
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
					ref={(el: HTMLDivElement) => {
						this.optionsDiv = el
					}}>
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
					{this.addedItems}
				</div>
			</Host>
		)
	}
}
