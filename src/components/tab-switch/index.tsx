import { Component, Element, Event, EventEmitter, h, Host, Listen, State, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-tab-switch",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTabSwitch {
	@Element() element: HTMLSmoothlyTabSwitchElement
	@State() selectedElement: HTMLSmoothlyTabElement
	@Event() selectedTab: EventEmitter<string>
	@Listen("expansionOpen")
	openChanged(event: CustomEvent) {
		event.stopPropagation()
		this.selectedElement = event.target as HTMLSmoothlyTabElement
		this.element.after(event.detail)
		this.selectedTab.emit(this.selectedElement.label)
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
