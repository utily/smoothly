import { Component, h, Host, Listen } from "@stencil/core"
import { Option } from "../option"

@Component({
	tag: "smoothly-picker-menu",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerMenu {
	private selected = new Map<any, Option>()
	private search = ""
	@Listen("smoothlyPickerOptionLoaded")
	optionLoadedHandler(event: CustomEvent<Option>) {
		this.selected.set(event.detail.name, event.detail)
	}
	inputHandler(event: CustomEvent<Record<string, any>>) {
		event.stopPropagation()
		this.search = event.detail.search
		if (!this.search)
			for (const option of this.selected.values())
				option.show()
		else
			for (const option of this.selected.values())
				option.name.includes(this.search) ? option.show() : option.hide()
	}
	render() {
		return (
			<Host>
				<smoothly-input
					name={"search"}
					onSmoothlyInput={e => this.inputHandler(e)}
					onSmoothlyChange={e => this.inputHandler(e)}>
					Search
				</smoothly-input>
				<div class={"items"}>
					<slot />
				</div>
			</Host>
		)
	}
}
