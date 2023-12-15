import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { Option } from "../../model"

@Component({
	tag: "smoothly-menu-options",
	styleUrl: "style.scss",
	shadow: true,
})
export class SmoothlyMenuOptions {
	private firstOptionsElement: HTMLSmoothlyOptionElement
	private optionElements: HTMLSmoothlyOptionElement[] = []
	@Element() element: HTMLElement
	@State() filteredOptions: (Option & { checked?: boolean })[] = []
	@State() highlightIndex = 0
	@State() keyword?: string
	@Prop() toggle = false
	@Prop({ mutable: true }) emptyMenuLabel = "No Options"
	@Prop() newOptionLabel = "Add:"
	@Prop() maxMenuHeight: "inherit"
	@Prop() order = false
	@Prop() optionStyle: any
	@Prop({ mutable: true, reflect: true }) options: Option[] = []
	@Prop({ mutable: true }) resetHighlightOnOptionsChange = true
	@Prop() mutable = false
	@Event() menuEmpty: EventEmitter<boolean>
	@Watch("options")
	optionsChangeHandler() {
		this.highlightIndex = this.resetHighlightOnOptionsChange ? 0 : this.highlightIndex
	}
	@Listen("optionHover")
	optionHoverHandler(event: CustomEvent<{ value: any; name: string }>) {
		if (event.detail.value)
			this.setHighlight(event.detail.value)
		event.stopPropagation()
	}
	@Method()
	async moveHighlight(step: number) {
		if (this.filteredOptions.length > 0)
			this.setHighlight((this.highlightIndex + step + this.filteredOptions.length) % this.filteredOptions.length, true)
	}
	@Method()
	async setHighlight(newIndex: number | string, scrollToHighlight = false) {
		if (typeof newIndex == "number") {
			this.highlightIndex = newIndex
			scrollToHighlight && this.scrollTo(this.highlightIndex)
		} else {
			const value = newIndex
			let isHighlightSet = false
			this.filteredOptions.forEach((option, index) => {
				const highlight = option.value == value
				this.highlightIndex = highlight ? index : this.highlightIndex
				highlight && scrollToHighlight && this.scrollTo(index)
				isHighlightSet = highlight ? true : isHighlightSet
			})
			if (!isHighlightSet)
				this.setHighlight(0, true)
		}
	}
	@Method()
	async getHighlighted(): Promise<Option | undefined> {
		let result = undefined
		if (this.highlightIndex != undefined && this.filteredOptions.length > 0)
			result = this.filteredOptions[this.highlightIndex]
		return result
	}
	@Method()
	async filterOptions(keyword: string, excludeValues: string[] = []) {
		this.keyword = keyword
		const keywordLowercase = keyword.toLowerCase()
		this.filteredOptions = []
		if (keywordLowercase == "") {
			this.showAllOptions()
		} else {
			for (const option of this.options) {
				const names = option.name + (option.aliases ? option.aliases.join(" ") : "")
				const isVisible = names.toLowerCase().includes(keywordLowercase) && !excludeValues.includes(option.value)
				isVisible && this.filteredOptions.push(option)
			}
		}

		this.menuEmpty.emit(!this.filteredOptions.length)
		this.order && this.sortOptions(keyword)
	}
	showAllOptions() {
		this.filteredOptions = [...this.options]
	}
	sortOptions(keyword: string) {
		const keywordLowercase = keyword.toLowerCase()
		this.filteredOptions.sort((a: Option, b: Option) => {
			return this.getPriorityScore(a, keywordLowercase) - this.getPriorityScore(b, keywordLowercase)
		})
	}
	getPriorityScore(option: Option, keywordLowercase: string) {
		let result = Number.MAX_SAFE_INTEGER
		const name = option.name
		const aliases = option.aliases ? option.aliases.join(" ") : ""
		const names = `${name ? name : ""} ${aliases ? aliases : ""}`.toLowerCase()
		if (name) {
			result = names.split(" ").reduce((minIndex: number, word: string) => {
				const index = word.indexOf(keywordLowercase)
				return index != -1 && index < minIndex ? index : minIndex
			}, Number.MAX_SAFE_INTEGER)
		}
		return result
	}
	scrollTo(optionIndex: number) {
		const optionHeight = this.firstOptionsElement?.getBoundingClientRect().height
		if (optionHeight) {
			const menuHeight = this.element.getBoundingClientRect().height
			const scrollPosition = this.element.scrollTop
			const optionPosition = optionIndex * optionHeight
			const numOptionsInMenu = Math.floor(menuHeight / optionHeight)
			if (optionPosition - optionHeight / 2 < scrollPosition)
				this.element.scrollTo({ top: (optionIndex - 1) * optionHeight })
			else if (scrollPosition < optionPosition + optionHeight - menuHeight)
				this.element.scrollTo({ top: (optionIndex + 1 - numOptionsInMenu) * optionHeight })
		}
	}

	render() {
		return (
			<Host style={{ "--max-menu-height": this.maxMenuHeight }}>
				{this.filteredOptions.length > 0 ? (
					this.filteredOptions.map((option, index) => (
						<smoothly-option
							style={this.optionStyle}
							key={option.value}
							toggle={option.toggle ?? this.toggle}
							ref={el => {
								index == 0 && (this.firstOptionsElement = el ?? this.firstOptionsElement)
								el && (this.optionElements[index] = el)
							}}
							checked={option.checked}
							value={option.value}
							name={option.name}
							divider={option.divider}
							data-highlight={this.highlightIndex == index}>
							{option.hint ? <div slot="hint">{option.hint}</div> : undefined}
						</smoothly-option>
					))
				) : this.mutable ? (
					<smoothly-option
						style={this.optionStyle}
						value={this.keyword}
						name={this.keyword}
						data-highlight={0}
						new={true}>
						<div slot="left">
							<smoothly-icon name="square-outline" size="small"></smoothly-icon> {this.newOptionLabel}
						</div>
					</smoothly-option>
				) : (
					<div>{this.emptyMenuLabel}</div>
				)}
			</Host>
		)
	}
}
