import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from "@stencil/core"
import { isSmoothlyTabElement } from "./isSmoothlyTabElement"

@Component({
	tag: "smoothly-tabs",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTabs {
	@Prop({ reflect: true }) tabs: "always" | "multiple" = "always"
	@State() tabElements: HTMLElement[] = []
	@State() selectedElement: HTMLSmoothlyTabElement
	@Event() smoothlyTabOpen: EventEmitter<string>

	@Listen("smoothlyTabLoad")
	onInputLoad(event: CustomEvent) {
		event.stopPropagation()
		if (event.target instanceof HTMLElement && !this.tabElements.includes(event.target)) {
			this.tabElements = [...this.tabElements, event.target]
		}
	}

	@Listen("smoothlyTabOpen")
	openChanged(event: CustomEvent) {
		const target = event.target
		if (isSmoothlyTabElement(target)) {
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
				style={{ "--tabs": `${this.tabElements.length}` }}>
				<slot />
			</Host>
		)
	}
}
