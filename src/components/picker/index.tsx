import { Component, Element, h, Host, Listen, Prop, State } from "@stencil/core"
import { OptionType } from "../../model"

@Component({
	tag: "smoothly-picker",
	styleUrl: "style.scss",
	shadow: true,
})
export class SmoothlyPicker {
	private inputElement: HTMLInputElement
	private keepFocusOnReRender = false
	private menuElement: HTMLSmoothlyMenuOptionsElement
	@Element() element: HTMLElement
	@State() isOpen: boolean
	@Prop() maxMenuHeight: "inherit"
	@Prop({ reflect: true }) multiple = false
	@Prop({ reflect: true }) options: OptionType[]
	@Prop({ reflect: true }) label: string
	@Prop({ mutable: true }) selections: { name: string; value: string }[] = []

	componentDidRender() {
		this.filterOptions()
		if (this.keepFocusOnReRender) {
			this.inputElement.focus()
			this.keepFocusOnReRender = false
		}
	}
	@Listen("optionSelect")
	optionSelectHander(event: CustomEvent<{ name: string; value: string }>) {
		this.select(event.detail)
		event.stopPropagation()
	}
	select(selection: { name: string; value: string }) {
		const isNewSelection = this.selections.reduce((acc, current) => acc && current.value != selection.value, true)
		if (isNewSelection)
			this.selections = this.multiple ? [...this.selections, selection] : [selection]
		this.inputElement.value = ""
		this.filterOptions()
		this.keepFocusOnReRender = true
		this.isOpen = this.multiple
	}
	unselect(selection: { name: string; value: string }) {
		const index = this.selections.map(selection => selection.value).indexOf(selection.value)
		if (index != -1) {
			this.selections = [
				...this.selections.slice(0, index),
				...this.selections.slice(index + 1, this.selections.length),
			]
			this.keepFocusOnReRender = true
		}
	}
	selectHighlighted() {
		this.menuElement?.getHighlighted().then((result: { name: string; value: string } | undefined) => {
			result ? this.select(result) : undefined
		})
	}
	highlightDefault() {
		this.filterOptions()
		this.menuElement?.setHighlight(this.multiple || this.selections.length == 0 ? 0 : this.selections[0].value)
	}
	filterOptions() {
		this.menuElement.filterOptions(
			this.inputElement.value,
			this.multiple ? this.selections.map(selection => selection.value) : []
		)
	}

	onInput(event: UIEvent) {
		this.isOpen = this.inputElement.value != "" ? true : this.isOpen
		this.highlightDefault()
	}
	onKeyDown(event: KeyboardEvent) {
		if (event.key == "ArrowUp" || event.key == "ArrowDown") {
			this.menuElement?.moveHighlight(event.key == "ArrowUp" ? -1 : 1)
			event.preventDefault()
		} else if (event.key == "Enter" && this.isOpen)
			this.selectHighlighted()
		else if (event.key == "Escape") {
			this.inputElement.value = ""
			this.isOpen = false
			this.filterOptions()
		} else if (event.key == " " && this.inputElement.value == "") {
			event.preventDefault()
			this.isOpen = true
			this.filterOptions()
		} else if (
			(event.key == "Backspace" || event.key == "Delete") &&
			this.inputElement.value == "" &&
			this.selections.length > 0
		) {
			this.unselect(this.selections[this.selections.length - 1])
		}
	}
	onClick() {
		this.isOpen = !this.isOpen
		this.inputElement.focus()
		this.highlightDefault()
		this.filterOptions()
	}
	onBlur() {
		this.inputElement.value = ""
		this.isOpen = false
		this.filterOptions()
	}
	onCrossClick(event: MouseEvent) {
		this.selections = []
		this.isOpen = false
		this.inputElement.focus()
		this.keepFocusOnReRender = true
		/* Stop propagation so host is not clicked */
		event.stopPropagation()
	}

	render() {
		const selectionList = this.multiple
			? this.selections.map(selection => (
					<li data-value={selection.value}>
						{selection.name}
						<smoothly-icon
							onClick={e => {
								this.unselect(selection)
								e.stopPropagation()
							}}
							name="close"
							size="small"></smoothly-icon>
					</li>
			  ))
			: null

		return (
			<Host
				has-selection={this.selections.length > 0}
				is-open={this.isOpen ? "" : undefined}
				onMouseDown={(e: MouseEvent) => e.preventDefault()}
				onClick={() => this.onClick()}>
				<ul>
					{selectionList}
					<li>
						<input
							type="text"
							ref={(el: HTMLInputElement) => (this.inputElement = el ? el : this.inputElement)}
							onFocus={() => this.highlightDefault()}
							onBlur={() => this.onBlur()}
							placeholder={this.multiple ? "" : this.selections.length > 0 ? this.selections[0].name : ""}
							onKeyDown={e => this.onKeyDown(e)}
							onInput={(e: UIEvent) => this.onInput(e)}></input>
					</li>
				</ul>
				<label>{this.label}</label>
				<smoothly-icon name="chevron-up" data-arrow="up"></smoothly-icon>
				<smoothly-icon name="chevron-down" data-arrow="down"></smoothly-icon>
				<smoothly-icon name="close" onClick={(e: MouseEvent) => this.onCrossClick(e)}></smoothly-icon>
				<smoothly-menu-options
					style={{ width: "100%" }}
					order={true}
					max-menu-height={this.maxMenuHeight}
					ref={(el: HTMLSmoothlyMenuOptionsElement) => (this.menuElement = el)}
					onClick={e => e.stopPropagation()}
					options={this.options}></smoothly-menu-options>
			</Host>
		)
	}
}
