import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from "@stencil/core"
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
	@Prop() maxHeight: string
	@Prop({ mutable: true }) emptyMenuLabel = "No Options"
	@Prop({ reflect: true }) multiple = false
	@Prop() optionStyle: any
	@Prop({ reflect: true }) options: OptionType[]
	@Prop({ reflect: true }) labelSetting: "hide" | "default"
	@Prop({ reflect: true }) label: string
	@Prop({ mutable: true }) selections: OptionType[] = []
	@Prop({ mutable: true }) selectNoneName = "Select None"
	@Event()
	menuClose: EventEmitter<OptionType[]>

	@Watch("selections")
	@Watch("isOpen")
	isOpenChangeHander() {
		if (this.isOpen == false) {
			this.menuClose.emit(this.selections)
		}
	}

	componentDidRender() {
		this.filterOptions()
		if (this.keepFocusOnReRender) {
			this.inputElement.focus()
			this.keepFocusOnReRender = false
		}
	}
	@Listen("optionSelect")
	optionSelectHander(event: CustomEvent<OptionType>) {
		event.detail.value == "select-none"
			? this.clearSelection()
			: this.selections?.map(s => s.value).includes(event.detail.value)
			? this.unselect(event.detail)
			: this.select(event.detail)
		event.stopPropagation()
	}
	select(selection: OptionType) {
		const isNewSelection = this.selections.reduce((acc, current) => acc && current.value != selection.value, true)
		if (isNewSelection)
			this.selections = this.multiple ? [...this.selections, selection] : [selection]
		this.inputElement.value = ""
		this.filterOptions()
		// this.keepFocusOnReRender = true
		this.isOpen = this.multiple
		const optionIndex = this.options.map(s => s.value).indexOf(selection.value)
		if (optionIndex != -1)
			this.options[optionIndex].description = "X"
	}
	unselect(selection: OptionType) {
		const index = this.selections.map(selection => selection.value).indexOf(selection.value)
		if (index != -1) {
			this.selections = [
				...this.selections.slice(0, index),
				...this.selections.slice(index + 1, this.selections.length),
			]
			this.keepFocusOnReRender = true
		}
		const optionIndex = this.options.map(s => s.value).indexOf(selection.value)
		if (optionIndex != -1)
			this.options[optionIndex].description = ""
	}
	selectHighlighted() {
		this.menuElement?.getHighlighted().then((result: OptionType | undefined) => {
			result && this.select(result)
		})
	}
	highlightDefault() {
		this.filterOptions()
		this.menuElement?.setHighlight(this.multiple || this.selections.length == 0 ? 0 : this.selections[0].value)
	}
	filterOptions() {
		this.menuElement.filterOptions(this.inputElement.value, [])
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
	clearSelection() {
		this.selections = []
		this.inputElement.focus()
		this.keepFocusOnReRender = true
		this.options = this.options.map((option: OptionType) => {
			return { ...option, description: "" } as OptionType
		})
	}

	render() {
		const cssVariables = {
			"--max-height": this.maxHeight ?? "inherit",
			"--label-display": this.labelSetting == "hide" ? "none" : "absolute",
		}
		const selectionList = this.multiple ? this.selections.map(selection => selection.name).join(", ") : ""
		return (
			<Host
				style={cssVariables}
				has-selection={this.selections.length > 0}
				is-open={this.isOpen ? "" : undefined}
				onMouseDown={(e: MouseEvent) => e.preventDefault()}
				onClick={() => this.onClick()}>
				<div>
					<label>{this.label}</label>
					<input
						type="text"
						ref={(el: HTMLInputElement) => (this.inputElement = el ? el : this.inputElement)}
						onFocus={() => this.highlightDefault()}
						onBlur={() => this.onBlur()}
						placeholder={this.multiple ? selectionList : this.selections.length > 0 ? this.selections[0].name : ""}
						onKeyDown={e => this.onKeyDown(e)}
						onInput={(e: UIEvent) => this.onInput(e)}></input>
				</div>
				<smoothly-menu-options
					style={{ width: "100%" }}
					optionStyle={this.optionStyle}
					order={false}
					emptyMenuLabel={this.emptyMenuLabel}
					max-menu-height={this.maxMenuHeight}
					ref={(el: HTMLSmoothlyMenuOptionsElement) => (this.menuElement = el)}
					onClick={e => e.stopPropagation()}
					resetHighlightOnOptionsChange={false}
					options={[
						{ value: "select-none", name: this.selectNoneName, description: this.selections.length == 0 ? "X" : "" },
						...this.options,
					]}></smoothly-menu-options>
			</Host>
		)
	}
}
