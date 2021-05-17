import { Component, Element, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { OptionType } from "../../model"

@Component({
	tag: "smoothly-menu-options",
	styleUrl: "style.scss",
	shadow: true,
})
export class SmoothlyMenuOptions {
	private firstOptionsElement: HTMLSmoothlyOptionElement
	@Element() element: HTMLElement
	@State() filteredOptions: OptionType[] = []
	@State() highlightIndex = 0
	@Prop({ mutable: true }) emptyMenuLabel = "No Options"
	@Prop() maxMenuHeight: "inherit"
	@Prop() order = false
	@Prop() optionStyle: any
	@Prop({ mutable: true, reflect: true }) options: OptionType[] = []
	@Watch("options")
	optionsChangeHandler(newOptions: OptionType[]) {
		this.highlightIndex = 0
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
	async getHighlighted(): Promise<OptionType | undefined> {
		let result = undefined
		if (this.highlightIndex != undefined && this.filteredOptions.length > 0)
			result = this.filteredOptions[this.highlightIndex]
		return result
	}
	@Method()
	async filterOptions(keyword: string, excludeValues: string[] = []) {
		const keywordLowercase = keyword.toLowerCase()
		this.filteredOptions = []
		for (const option of this.options) {
			const names = option.name + (option.aliases ? option.aliases.join(" ") : "")
			const isVisible = names.toLowerCase().includes(keywordLowercase) && !excludeValues.includes(option.value)
			isVisible && this.filteredOptions.push(option)
		}
		this.order && this.sortOptions(keyword)
	}
	sortOptions(keyword: string) {
		const keywordLowercase = keyword.toLowerCase()
		this.filteredOptions.sort((a: OptionType, b: OptionType) => {
			return this.getPriorityScore(a, keywordLowercase) - this.getPriorityScore(b, keywordLowercase)
		})
	}
	getPriorityScore(option: OptionType, keywordLowercase: string) {
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
							ref={el => index == 0 && (this.firstOptionsElement = el ?? this.firstOptionsElement)}
							value={option.value}
							name={option.name}
							data-highlight={this.highlightIndex == index}>
							{option.description}
						</smoothly-option>
					))
				) : (
					<div>{this.emptyMenuLabel}</div>
				)}
			</Host>
		)
	}
}
