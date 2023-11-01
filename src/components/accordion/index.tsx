import { Component, Element, h, Listen, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-0-accordion",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAccordion {
	private items: HTMLSmoothly0AccordionItemElement[] = []
	@Element() me: HTMLElement
	@Prop({ mutable: true }) value?: string
	@Watch("value")
	valueChanged(value: string | undefined) {
		this.updateItems()
	}
	@Listen("smoothlyOpen")
	@Listen("smoothlyClose")
	handleOpenClose(event: CustomEvent<{ name: string; open: boolean }>) {
		if (event.detail.open)
			this.value = event.detail.name
		else if (this.value == event.detail.name)
			this.value = undefined
	}
	@Listen("smoothlyAccordionItemDidLoad")
	onAccordionItemDidLoad(ev: Event) {
		const item = ev.target as HTMLSmoothly0AccordionItemElement
		this.items.push(item)
		if (this.value == undefined && item.open)
			this.value = item.name
		else
			this.updateItems()
	}
	@Listen("smoothlyAccordionItemDidUnload")
	onAccordionItemDidUnload(ev: Event) {
		const index = this.items.indexOf(ev.target as HTMLSmoothly0AccordionItemElement)
		if (index > -1)
			this.items.splice(index, 1)
	}
	componentDidLoad() {
		this.updateItems()
	}
	private updateItems() {
		let hasChecked = false
		for (const item of this.items)
			if ((item.open = !hasChecked && item.name == this.value))
				hasChecked = true
	}

	render() {
		return [<slot></slot>]
	}
}
