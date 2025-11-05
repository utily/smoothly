import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-tabs",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTabs {
	@Element() element: HTMLSmoothlyTabsElement
	@Prop({ reflect: true }) tabs: "always" | "multiple" = "always"
	@Prop() numberOfTabs: number
	@State() tabElements: HTMLSmoothlyTabElement[] = []
	@State() selectedElement: HTMLSmoothlyTabElement
	@Event() smoothlyTabOpen: EventEmitter<string>

	@Method()
	async removeTab(tab: HTMLSmoothlyTabElement) {
		if (this.element.isConnected) {
			this.tabElements = this.tabElements.filter(element => element !== tab)
			if (tab.open) {
				const firstOpenableTab = this.tabElements.find(element => !element.disabled)
				firstOpenableTab && (firstOpenableTab.open = true)
			}
		}
	}

	@Listen("smoothlyTabLoad")
	onInputLoad(event: CustomEvent<(smoothlyTabs: SmoothlyTabs) => void>) {
		event.stopPropagation()
		if (
			this.isSmoothlyTabElement(event.target) &&
			event.target.parentElement == this.element &&
			!this.tabElements.includes(event.target)
		) {
			event.detail(this)
			this.tabElements = [...this.tabElements, event.target]
		}
	}

	private isSmoothlyTabElement(element: any): element is HTMLSmoothlyTabElement {
		return element?.tagName == "SMOOTHLY-TAB"
	}

	@Listen("smoothlyTabOpen")
	openChanged(event: CustomEvent) {
		const target = event.target
		if (this.isSmoothlyTabElement(target)) {
			event.stopPropagation()
			this.selectedElement = target
			this.smoothlyTabOpen.emit(event.detail)
		}
	}
	@Watch("selectedElement")
	onSelectedChange(value: HTMLSmoothlyTabElement, old: HTMLSmoothlyTabElement) {
		if (old)
			old.open = false
	}

	render() {
		return (
			<Host
				class={{ "hide-tabs": this.tabs == "multiple" && this.tabElements.length == 1 }}
				style={{ "--tabs": `${this.numberOfTabs ?? this.tabElements.length}` }}>
				<slot />
			</Host>
		)
	}
}
