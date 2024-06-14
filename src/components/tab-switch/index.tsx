import { Component, Element, h, Host, Listen, State, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-0-tab-switch",
	styleUrl: "style.css",
	scoped: true,
})
export class Smoothly0TabSwitch {
	@Element() element: HTMLSmoothly0TabSwitchElement
	@State() selectedElement: HTMLSmoothly0TabElement
	@Listen("expansionOpen")
	openChanged(event: CustomEvent) {
		event.stopPropagation()
		this.selectedElement = event.target as HTMLSmoothly0TabElement
		this.selectedElement.open = true
		this.element.after(event.detail)
	}
	@Watch("selectedElement")
	onSelectedChange(value: HTMLSmoothly0TabElement, old: HTMLSmoothly0TabElement) {
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
