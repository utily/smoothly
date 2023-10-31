import { Component, Element, h, Host, Listen, State, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-0-tab-switch",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTabSwitch {
	@Element() element: HTMLSmoothlyTabSwitchElement
	@State() selectedElement: HTMLSmoothlyTabElement
	@Listen("expansionOpen")
	openChanged(event: CustomEvent) {
		event.stopPropagation()
		this.selectedElement = event.target as HTMLSmoothlyTabElement
		this.selectedElement.open = true
		this.element.after(event.detail)
	}
	@Watch("selectedElement")
	onSelectedChange(value: HTMLSmoothlyTabElement, old: HTMLSmoothlyTabElement) {
		if (old)
			old.open = false
	}

	render() {
		return (
			<Host>
				<slot></slot>
			</Host>
		)
	}
}
