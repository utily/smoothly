import { Component, Element, h, Host, Listen, Method, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-menu-options",
	styleUrl: "style.scss",
	shadow: true,
})
export class SmoothlyMenuOptions {
	private emptyMenuElement: HTMLDivElement
	private filteredOptions: HTMLElement[] = []
	private highlightIndex = 0
	@Element() element: HTMLElement
	@Prop({ mutable: true }) emptyMenuLabel = "No Options"
	@Prop() maxMenuHeight: "inherit"
	@Prop({ mutable: true }) width = "85%"
	componentDidRender() {
		this.filterOptions("")
	}
	@Listen("optionHover")
	optionHoverHandler(event: CustomEvent<{ name: string; value: string }>) {
		if (event.detail.value)
			this.setHighlight(event.detail.value)
		event.stopPropagation()
	}
	@Method()
	async moveHighlight(step: number) {
		this.setHighlight((this.highlightIndex + step + this.filteredOptions.length) % this.filteredOptions.length, true)
	}
	@Method()
	async setHighlight(newIndex: number | string, scrollToHighlight = false) {
		if (typeof newIndex == "number") {
			this.highlightIndex = newIndex
			this.filteredOptions.forEach((option, index) => {
				if (index == this.highlightIndex) {
					option.setAttribute("data-highlight", "")
					scrollToHighlight ? this.scrollTo(index, option.getBoundingClientRect().height) : undefined
				} else
					option.removeAttribute("data-highlight")
			})
		} else {
			const value = newIndex
			let isHighlightSet = false
			this.filteredOptions.forEach((option, index) => {
				const highlight = option.getAttribute("value") == value
				this.highlightIndex = highlight ? index : this.highlightIndex
				highlight ? option.setAttribute("data-highlight", "") : option.removeAttribute("data-highlight")
				highlight && scrollToHighlight ? this.scrollTo(index, option.getBoundingClientRect().height) : undefined
				isHighlightSet = highlight ? true : isHighlightSet
			})
			if (!isHighlightSet)
				this.setHighlight(0, true)
		}
	}
	@Method()
	async getHighlighted(): Promise<{ name: string; value: string } | undefined> {
		let result = undefined
		let selectedOption: HTMLElement | null = null
		for (let index = 0; index < this.filteredOptions.length; index++) {
			const currentOption = this.filteredOptions[index]
			if (index == this.highlightIndex) {
				selectedOption = currentOption
				break
			}
		}
		if (selectedOption) {
			const value = selectedOption.getAttribute("value")
			const name = selectedOption.getAttribute("name")
			if (name && value) {
				const selection = { name, value }
				result = selection
			}
		}
		return result
	}
	@Method()
	async filterOptions(keyword: string, excludeValues: string[] = []) {
		const keywordLowercase = keyword.toLowerCase()
		this.filteredOptions = []
		const options = Array.from(this.element.children as HTMLCollectionOf<HTMLElement>)
		if (options) {
			for (const option of options) {
				const isValidOption =
					option.nodeName == "SMOOTHLY-OPTION" && option.hasAttribute("value") && option.hasAttribute("name")
				const name = option.getAttribute("name")
				const aliases = option.getAttribute("aliases")?.toLowerCase()
				const names = `${name ? name : ""} ${aliases ? aliases : ""}`
				const value = option.getAttribute("value")
				const isVisible = names?.toLowerCase().includes(keywordLowercase) && value && !excludeValues.includes(value)
				option.style.display = isValidOption && isVisible ? "" : "none"
				if (isValidOption && isVisible)
					this.filteredOptions.push(option)
			}
			this.emptyMenuElement.style.display = this.filteredOptions.length == 0 ? "block" : "none"
		}
	}
	scrollTo(optionIndex: number, optionHeight: number) {
		const menuHeight = this.element.getBoundingClientRect().height
		const scrollPosition = this.element.scrollTop
		const optionPosition = optionIndex * optionHeight
		const numOptionsInMenu = Math.floor(menuHeight / optionHeight)
		if (optionPosition - optionHeight / 2 < scrollPosition)
			this.element.scrollTo({ top: (optionIndex - 1) * optionHeight })
		else if (scrollPosition < optionPosition + optionHeight - menuHeight)
			this.element.scrollTo({ top: (optionIndex + 1 - numOptionsInMenu) * optionHeight })
	}

	render() {
		return (
			<Host style={{ "--width": this.width, "--max-menu-height": this.maxMenuHeight }}>
				<slot></slot>
				<div ref={(el: HTMLDivElement) => (this.emptyMenuElement = el)}>{this.emptyMenuLabel}</div>
			</Host>
		)
	}
}
