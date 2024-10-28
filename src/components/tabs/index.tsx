import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-tabs",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTabs {
	@Element() element: HTMLSmoothlyTabsElement
	@State() selectedElement: HTMLSmoothlyTabElement
	@Event() selectedTab: EventEmitter<string>
	@Prop({ reflect: true }) filled = false
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
