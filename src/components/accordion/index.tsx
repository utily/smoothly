import { Component, Element, h, Listen, Method, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-accordion",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAccordion {
	private items: HTMLSmoothlyAccordionItemElement[] = []
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
	@Listen("smoothlyAccordionItemWillLoad")
	onAccordionItemDidLoad(ev: Event) {
		const item = ev.target as HTMLSmoothlyAccordionItemElement
		this.items.push(item)
		if (this.value == undefined && item.open)
			this.value = item.name
		else
			this.updateItems()
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
	@Method()
	async removeItem(el: HTMLSmoothlyAccordionItemElement) {
		const index = this.items.indexOf(el)
		if (index > -1)
			this.items.splice(index, 1)
	}
	render() {
		return [<slot></slot>]
	}
}
