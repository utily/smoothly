import { Component, Element, h, Host, Listen, Prop, State } from "@stencil/core"
import { Option } from "../option"
@Component({
	tag: "smoothly-picker-menu",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerMenu {
	@Element() element: HTMLElement
	@Prop({ reflect: true }) multiple = false
	@Prop({ reflect: true }) mutable = false
	@Prop() label = "Search"
	@Prop() validator?: (value: string) => boolean
	@Prop() labeledDefault = false
	@State() allowed = false
	@State() new: string[] = []
	@State() search = ""
	private options = new Map<any, Option>()

	@Listen("smoothlyPickerOptionLoaded")
	optionLoadedHandler(event: CustomEvent<Option>) {
		this.options.set(event.detail.element.name, event.detail)
	}
	inputHandler(event: CustomEvent<Record<string, any>>) {
		event.stopImmediatePropagation()
		this.search = event.detail.search
		if (!this.search) {
			this.allowed = false
			for (const option of this.options.values())
				option.element.visible = true
		} else {
			this.allowed = !Array.from(this.options.values()).find(option => option.value == this.search)
			for (const option of this.options.values())
				option.element.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())
					? (option.element.visible = true)
					: (option.element.visible = false)
		}
	}
	addHandler() {
		if (!this.validator || this.validator(this.search)) {
			this.new = [...this.new, this.search]
			this.search = ""
		}
	}
	render() {
		return (
			<Host>
				<div class={"controls"}>
					<smoothly-input
						name={"search"}
						value={this.search}
						onSmoothlyInput={e => this.inputHandler(e)}
						onSmoothlyChange={e => this.inputHandler(e)}>
						{this.label}
					</smoothly-input>
					{this.mutable ? (
						<button onClick={() => this.addHandler()} disabled={!this.allowed} class={"add"} type={"button"}>
							<smoothly-icon name="add-outline" />
						</button>
					) : null}
				</div>
				<div class={"items"}>
					{this.new.map(value => (
						<smoothly-picker-option labeled={this.labeledDefault} selected value={value}>
							{value}
						</smoothly-picker-option>
					))}
					<slot />
				</div>
			</Host>
		)
	}
}
