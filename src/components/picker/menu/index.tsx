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
	@State() allowed = false
	private options = new Map<any, Option>()
	@Listen("smoothlyPickerOptionLoaded")
	optionLoadedHandler(event: CustomEvent<Option>) {
		this.options.set(event.detail.element.name, event.detail)
	}
	inputHandler(event: CustomEvent<Record<string, any>>) {
		event.stopPropagation()
		if (!event.detail.search) {
			this.allowed = false
			for (const option of this.options.values())
				option.element.visible = true
		} else {
			this.allowed = !Array.from(this.options.values()).find(option => option.value == event.detail.search)
			for (const option of this.options.values())
				option.element.name.toLocaleLowerCase().includes(event.detail.search.toLocaleLowerCase())
					? (option.element.visible = true)
					: (option.element.visible = false)
		}
	}
	render() {
		return (
			<Host>
				<div class={"controls"}>
					<smoothly-input
						name={"search"}
						onSmoothlyInput={e => this.inputHandler(e)}
						onSmoothlyChange={e => this.inputHandler(e)}>
						{this.label}
					</smoothly-input>
					{this.mutable ? (
						<button disabled={!this.allowed} class={"add"} type={"button"}>
							<smoothly-icon name="add-outline" />
						</button>
					) : null}
				</div>
				<div class={"items"}>
					<slot />
				</div>
			</Host>
		)
	}
}
