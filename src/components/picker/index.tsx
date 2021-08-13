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
	@Event() menuClose: EventEmitter<OptionType[]>

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
		this.toggle(event.detail)
		event.stopPropagation()
	}
	toggle(option: OptionType) {
		option.value == "select-none"
			? this.clearSelection()
			: this.selections.map(s => s.value).includes(option.value)
			? this.unselect(option)
			: this.select(option)
	}
	clearSelection() {
		this.selections = []
		this.inputElement.focus()
		this.keepFocusOnReRender = true
		this.options?.forEach(option => (option.description = ""))
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
		const optionIndex = this.options?.map(s => s.value).indexOf(selection.value)
		if (optionIndex != -1)
			this.options[optionIndex].description = ""
	}
	select(selection: OptionType) {
		const isNewSelection = this.selections.reduce((acc, current) => acc && current.value != selection.value, true)
		if (isNewSelection)
			this.selections = this.multiple ? [...this.selections, selection] : [selection]
		this.inputElement.value = ""
		this.filterOptions()
		this.keepFocusOnReRender = true
		this.isOpen = this.multiple
		this.options?.forEach(
			option =>
				(option.description =
					option.value == selection.value ? this.getCheckHtml() : this.multiple ? option.description : "")
		)
	}
	toggleHighlighted() {
		this.menuElement?.getHighlighted().then((result: OptionType | undefined) => {
			result && this.toggle(result)
		})
	}
	highlightDefault() {
		this.filterOptions()
		this.menuElement?.setHighlight(this.multiple || this.selections.length == 0 ? 0 : this.selections[0].value)
	}
	filterOptions() {
		this.menuElement?.filterOptions(this.inputElement.value, [])
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
			this.toggleHighlighted()
		else if (event.key == "Escape") {
			this.inputElement.value = ""
			this.isOpen = false
			this.filterOptions()
		} else if (event.key == " " && this.inputElement.value == "") {
			event.preventDefault()
			this.isOpen = true
			this.filterOptions()
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
	getCheckHtml(): HTMLElement {
		return <smoothly-icon name="checkmark-sharp" size="small"></smoothly-icon>
	}

	render() {
		const cssVariables = {
			"--max-height": this.maxHeight ?? "inherit",
			"--label-display": this.labelSetting == "hide" ? "none" : "absolute",
		}
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
						placeholder={this.selections.map(selection => selection.name).join(", ")}
						onKeyDown={e => this.onKeyDown(e)}
						onInput={(e: UIEvent) => this.onInput(e)}></input>
				</div>
				<smoothly-menu-options
					style={{ width: "100%" }}
					optionStyle={{ padding: "0 1em", height: "2.5em", ...this.optionStyle }}
					order={false}
					emptyMenuLabel={this.emptyMenuLabel}
					max-menu-height={this.maxMenuHeight}
					ref={(el: HTMLSmoothlyMenuOptionsElement) => (this.menuElement = el ?? this.menuElement)}
					onClick={e => e.stopPropagation()}
					resetHighlightOnOptionsChange={false}
					options={[
						{
							value: "select-none",
							name: this.selectNoneName,
							description: this.selections.length == 0 ? this.getCheckHtml() : "",
						},
						...(this.options ?? []),
					]}></smoothly-menu-options>
			</Host>
		)
	}
}
