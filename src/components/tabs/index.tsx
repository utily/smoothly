import { Component, Element, Event, EventEmitter, h, Host, Listen, State, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-tabs",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTabs {
	@Element() element: HTMLSmoothlyTabsElement
	@State() tabs: HTMLElement[] = []
	@State() selectedElement: HTMLSmoothlyTabElement
	@Event() smoothlyTabOpen: EventEmitter<string>

	@Listen("smoothlyTabLoad")
	onInputLoad(event: CustomEvent) {
		if (event.target instanceof HTMLElement && !this.tabs.includes(event.target)) {
			this.tabs = [...this.tabs, event.target]
		}
	}

	@Listen("smoothlyTabOpen")
	openChanged(event: CustomEvent) {
		event.stopPropagation()
		this.selectedElement = event.target as HTMLSmoothlyTabElement
		this.smoothlyTabOpen.emit(event.detail)
	}
	@Watch("selectedElement")
	onSelectedChange(value: HTMLSmoothlyTabElement, old: HTMLSmoothlyTabElement) {
		if (old)
			old.open = false
	}

	render() {
		return (
			<Host style={{ "--tabs": `${this.tabs.length}` }}>
				<slot></slot>
			</Host>
		)
	}
}
